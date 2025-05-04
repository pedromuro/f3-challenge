import {
  CnabTipoRegistro,
  CnabTipoServico,
  CnabCodigoSegmentoDetalhe,
} from '../types';

import { StructuresRegister } from './structures-registrator';

// !!! Não seguro para execução de múltiplas streams
let lastLoteHeaderBuffer: Buffer;

export const extractRegisterIdentifiers = (
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

export const parseLine = (
  lineBuffer: Buffer,
  register: StructuresRegister,
): { parsed: Record<string, unknown>; registerType: CnabTipoRegistro } => {
  const { registerType, serviceType, segmentType } =
    extractRegisterIdentifiers(lineBuffer) ?? {};

  const structure = register.getRegisterStructure({
    registerType,
    serviceType,
    segmentType,
  });

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
