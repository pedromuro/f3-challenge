import { CnabRegisterStructure } from '../types/cnab-register-structure.type';

import {
  CnabCodigoSegmentoDetalhe,
  CnabTipoRegistro,
  CnabTipoServico,
} from '../types/cnab-enums';

import { globSync } from 'node:fs';

import path from 'node:path';

export class StructuresRegister {
  private STRUCTURES_REGISTER: Partial<StructureRegister> = {};

  private SEGMENT_TYPE_REGISTER: Partial<SegmentTypeRegister> = {};

  private SERVICE_TYPE_REGISTER: Partial<ServiceTypeRegister> = {};

  private initialized = false;

  private initialize() {
    if (this.initialized) return;

    this.initialized = true;

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
  }

  public registerStructure(args: Args<CnabTipoRegistro>) {
    this.initialized = false;

    const { registerType, segmentType, serviceType, structure } = args;

    if (
      (registerType === CnabTipoRegistro.HEADER_LOTE ||
        registerType === CnabTipoRegistro.TRAILER_LOTE) &&
      serviceType !== undefined
    ) {
      this.SERVICE_TYPE_REGISTER[serviceType] = structure;

      return;
    }

    if (registerType === CnabTipoRegistro.DETALHE && segmentType) {
      this.SEGMENT_TYPE_REGISTER[segmentType] = structure;

      return;
    }

    this.STRUCTURES_REGISTER[registerType] = structure;
  }

  public getRegisterStructure(args: {
    registerType: CnabTipoRegistro;
    serviceType?: CnabTipoServico;
    segmentType?: CnabCodigoSegmentoDetalhe;
  }): CnabRegisterStructure | undefined {
    if (!this.initialized) this.initialize();

    const { registerType, segmentType, serviceType } = args;

    const isLoteHeaderOrTrailer =
      registerType === CnabTipoRegistro.HEADER_LOTE ||
      registerType === CnabTipoRegistro.TRAILER_LOTE;

    if (isLoteHeaderOrTrailer && serviceType !== undefined) {
      return this.SERVICE_TYPE_REGISTER[serviceType];
    }

    if (registerType === CnabTipoRegistro.DETALHE && segmentType) {
      return this.SEGMENT_TYPE_REGISTER[segmentType];
    }

    return this.STRUCTURES_REGISTER[registerType];
  }
}

export class StructuresRegistrator {
  private static instances: { [key in RegisterType]: StructuresRegister } = {
    complete: new StructuresRegister(),
    partial: new StructuresRegister(),
  };

  public static getInstance(type: RegisterType) {
    if (!this.instances[type]) {
      this.instances[type] = new StructuresRegister();
    }

    return this.instances[type];
  }
}

type Args<R extends CnabTipoRegistro> = {
  structure: CnabRegisterStructure;
  registerType: R;
} & (R extends CnabTipoRegistro.DETALHE
  ? { segmentType: CnabCodigoSegmentoDetalhe }
  : { segmentType?: never }) &
  (R extends CnabTipoRegistro.HEADER_LOTE | CnabTipoRegistro.TRAILER_LOTE
    ? { serviceType: CnabTipoServico }
    : { serviceType?: never });

type StructureRegister = Record<CnabTipoRegistro, CnabRegisterStructure>;

type SegmentTypeRegister = Record<
  CnabCodigoSegmentoDetalhe,
  CnabRegisterStructure
>;

type ServiceTypeRegister = Record<CnabTipoServico, CnabRegisterStructure>;

type RegisterType = 'complete' | 'partial';
