import { Transform } from 'node:stream';

import { pipeline } from 'node:stream/promises';

import {
  CnabCodigoSegmentoDetalhe,
  CnabTipoRegistro,
  CnabTipoServico,
} from '../types/cnab-enums';

import { getRegisterStructure } from './structures-registrator';

import { loadFile, writeFileStream } from './file-handler';

// Buffer do header do lote, usado para extrair o tipo de serviço do header do lote
let lastLoteHeaderBuffer: Buffer;

const extractRegisterIdentifiers = (
  buffer: Buffer,
): {
  registerType: CnabTipoRegistro;
  serviceType?: CnabTipoServico;
  segmentType?: CnabCodigoSegmentoDetalhe;
} => {
  const registerType = buffer.subarray(7, 8).toString() as CnabTipoRegistro;

  if (registerType === CnabTipoRegistro.HEADER_LOTE) {
    lastLoteHeaderBuffer = buffer;

    const serviceType = buffer.subarray(9, 11).toString() as CnabTipoServico;

    return { registerType, serviceType };
  }

  if (registerType === CnabTipoRegistro.TRAILER_LOTE) {
    // Extraindo o tipo de serviço do header do lote, pois esta informação
    // não existe no trailer do lote
    const { serviceType } = extractRegisterIdentifiers(lastLoteHeaderBuffer);

    return { registerType: CnabTipoRegistro.TRAILER_LOTE, serviceType };
  }

  if (registerType === CnabTipoRegistro.DETALHE) {
    const segmentType = buffer
      .subarray(13, 14)
      .toString() as CnabCodigoSegmentoDetalhe;

    return {
      registerType: CnabTipoRegistro.DETALHE,
      segmentType,
    };
  }

  if (Object.values(CnabTipoRegistro).includes(registerType)) {
    return { registerType };
  }

  throw new Error('Linha não pôde ser identificada');
};

const getReducer = (lineBuffer: Buffer) => {
  return (
    result: Record<string, unknown>,
    [key, value]: [string, object | number[]],
  ): Record<string, unknown> => {
    if (Array.isArray(value) && (value.length === 2 || value.length === 3)) {
      const [start, end] = value;

      const subarr = lineBuffer.subarray(start - 1, end);

      const subarrString = subarr.toString();

      result[key] = subarrString?.trim();

      return result;
    }

    const entries = Object.entries(value);

    const reducer = getReducer(lineBuffer);

    result[key] = entries.reduce<Record<string, unknown>>(
      reducer,
      {} as Record<string, unknown>,
    );

    return result;
  };
};

const parseLine = (
  lineBuffer: Buffer,
): { parsed: Record<string, unknown>; registerType: CnabTipoRegistro } => {
  const { registerType, serviceType, segmentType } =
    extractRegisterIdentifiers(lineBuffer) ?? {};

  const structure = getRegisterStructure(
    registerType,
    serviceType,
    segmentType,
  );

  if (!structure) {
    return {
      parsed: { raw: lineBuffer.toString() },
      registerType,
    };
  }

  const reducer = getReducer(lineBuffer);

  const entries: [string, object | number[]][] = Object.entries(structure);

  const parsed = entries.reduce<Record<string, unknown>>(reducer, {});

  return { parsed, registerType };
};

export async function main() {
  const readStream = loadFile('cnabExample.rem');

  const writeStream = writeFileStream('cnabExample.json');

  let firstLine = true;

  let currentLoteDetailsCount = 0;

  let isFirstLote = true;

  // const fstats = await stat('cnabExample.rem');

  const transform = new Transform({
    transform: function (lineChunk: Buffer, enc, cb) {
      const { parsed, registerType } = parseLine(lineChunk);

      let jsonChunk = '';

      const jsonString = JSON.stringify(parsed, null, 2);

      if (firstLine) {
        jsonChunk += '{';

        firstLine = false;
      }

      if (registerType === CnabTipoRegistro.HEADER_ARQUIVO) {
        jsonChunk += '"headerArquivo": ';

        jsonChunk += jsonString;

        jsonChunk += ',\n';

        jsonChunk += '"lotes": [\n';
      }

      if (registerType === CnabTipoRegistro.HEADER_LOTE) {
        currentLoteDetailsCount = 0;

        console.log('isFirstLote', isFirstLote);

        if (!isFirstLote) {
          jsonChunk += ',\n';
        }

        isFirstLote = false;

        jsonChunk += '{\n"headerLote": ';

        jsonChunk += jsonString;

        jsonChunk += ',\n';

        jsonChunk += '"detalhes": [\n';
      }

      if (registerType === CnabTipoRegistro.DETALHE) {
        if (currentLoteDetailsCount > 0) {
          jsonChunk += ',\n';
        }

        jsonChunk += jsonString;

        currentLoteDetailsCount++;
      }

      if (registerType === CnabTipoRegistro.TRAILER_LOTE) {
        jsonChunk += '],';

        jsonChunk += '"trailerLote": ';

        jsonChunk += jsonString;

        jsonChunk += '}\n';
      }

      if (registerType === CnabTipoRegistro.TRAILER_ARQUIVO) {
        jsonChunk += '],';

        jsonChunk += '"trailerArquivo": ';

        jsonChunk += jsonString;

        jsonChunk += '}\n';
      }

      cb(null, jsonChunk);
    },
  });

  await pipeline(readStream, transform, writeStream);

  console.log('done');
}

main();
