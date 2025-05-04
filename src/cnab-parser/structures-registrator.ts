import { CnabRegisterStructure } from '../types/cnab-register-structure.type';

import {
  CnabCodigoSegmentoDetalhe,
  CnabTipoRegistro,
  CnabTipoServico,
} from '../types/cnab-enums';

import { globSync } from 'node:fs';

import path from 'node:path';

type StructureRegister = Record<CnabTipoRegistro, CnabRegisterStructure>;

type SegmentTypeRegister = Record<
  CnabCodigoSegmentoDetalhe,
  CnabRegisterStructure
>;

type ServiceTypeRegister = Record<CnabTipoServico, CnabRegisterStructure>;

const STRUCTURES_REGISTER: Partial<StructureRegister> = {};

const SEGMENT_TYPE_REGISTER: Partial<SegmentTypeRegister> = {};

const SERVICE_TYPE_REGISTER: Partial<ServiceTypeRegister> = {};

let initialized = false;

type Args<R extends CnabTipoRegistro> = {
  structure: CnabRegisterStructure;
  registerType: R;
} & (R extends CnabTipoRegistro.DETALHE
  ? { segmentType: CnabCodigoSegmentoDetalhe }
  : { segmentType?: never }) &
  (R extends CnabTipoRegistro.HEADER_LOTE | CnabTipoRegistro.TRAILER_LOTE
    ? { serviceType: CnabTipoServico }
    : { serviceType?: never });

export const registerStructure = <R extends CnabTipoRegistro>(
  args: Args<R>,
) => {
  const { registerType, segmentType, serviceType, structure } = args;

  if (
    (registerType === CnabTipoRegistro.HEADER_LOTE ||
      registerType === CnabTipoRegistro.TRAILER_LOTE) &&
    serviceType !== undefined
  ) {
    SERVICE_TYPE_REGISTER[serviceType] = structure;

    return;
  }

  if (registerType === CnabTipoRegistro.DETALHE && segmentType) {
    SEGMENT_TYPE_REGISTER[segmentType] = structure;

    return;
  }

  STRUCTURES_REGISTER[registerType] = structure;
};

const initialize = () => {
  initialized = true;

  const globPattern = path.join(
    __dirname,
    '../',
    'cnab-structures',
    '**/*.{ts,js}',
  );

  const files = globSync(globPattern);

  for (const file of files) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require(file);
  }
};

export const getRegisterStructure = (
  registerType: CnabTipoRegistro,
  serviceType?: CnabTipoServico,
  segmentType?: CnabCodigoSegmentoDetalhe,
) => {
  if (!initialized) initialize();

  const isLoteHeaderOrTrailer =
    registerType === CnabTipoRegistro.HEADER_LOTE ||
    registerType === CnabTipoRegistro.TRAILER_LOTE;

  if (isLoteHeaderOrTrailer && serviceType !== undefined) {
    return SERVICE_TYPE_REGISTER[serviceType];
  }

  if (registerType === CnabTipoRegistro.DETALHE && segmentType) {
    return SEGMENT_TYPE_REGISTER[segmentType];
  }

  return STRUCTURES_REGISTER[registerType];
};
