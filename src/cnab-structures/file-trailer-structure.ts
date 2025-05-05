import { StructuresRegistrator } from '../cnab-parser/structures-registrator';

import { CnabRegisterStructure } from '../types/cnab-register-structure.type';

import { CnabTipoRegistro } from '../types/cnab-enums';

import { CnabControle } from '../types/common-cnab-types';

export type CnabTrailer = {
  controle: CnabControle;
  totais: {
    quantidadeLotes: string;
    quantidadeRegistros: string;
    quantidadeContas: string;
  };
};

type TrailerStructure = CnabRegisterStructure<CnabTrailer>;

export const FILE_TRAILER_STRUCTURE: TrailerStructure = {
  controle: {
    codBanco: [1, 3],
    loteServico: [4, 7],
    tipoRegistro: [8, 8, CnabTipoRegistro],
  },
  totais: {
    quantidadeLotes: [18, 23],
    quantidadeRegistros: [24, 29],
    quantidadeContas: [30, 35],
  },
};

StructuresRegistrator.getInstance().registerStructure({
  structure: FILE_TRAILER_STRUCTURE,
  registerType: CnabTipoRegistro.TRAILER_ARQUIVO,
});
