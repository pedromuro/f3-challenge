import { Transform, TransformCallback } from 'node:stream';

import { CnabTipoRegistro } from '../../types';

import { parseLine } from '../transformers-commons';

export const getCnabToJsonFullTransform = (): Transform => {
  let firstLine = true;

  let currentLoteDetailsCount = 0;

  let isFirstLote = true;

  return new Transform({
    transform(
      lineChunk: Buffer,
      encoding: BufferEncoding,
      callback: TransformCallback,
    ) {
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

      callback(null, jsonChunk);
    },
  });
};
