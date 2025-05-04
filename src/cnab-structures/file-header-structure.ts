import { StructuresRegistrator } from '../cnab-parser/structures-registrator';

import {
  CnabControle,
  CnabEmpresa,
  CnabRegisterStructure,
  CnabTipoRegistro,
} from '../types';

export type CnabHeader = {
  controle: CnabControle;
  empresa: CnabEmpresa;
  nomeBanco: string;
  arquivo: {
    codigo: string;
    dataGeracao: string;
    horaGeracao: string;
    sequenciaNsa: string;
    versaoLayout: string;
    densidadeGravacao: string;
  };
  reservadoEmpresa: string;
  reservadoBanco: string;
};

export type HeaderStructure = CnabRegisterStructure<CnabHeader>;

export const FILE_HEADER_COMPLETE_STRUCTURE: HeaderStructure = {
  controle: {
    codBanco: [1, 3],
    loteServico: [4, 7],
    tipoRegistro: [8, 8, CnabTipoRegistro],
  },
  empresa: {
    inscricao: {
      tipo: [18, 18],
      numero: [19, 32],
    },
    convenio: [33, 52],
    contaCorrente: {
      agencia: {
        codigo: [53, 57],
        dv: [58, 58],
      },
      conta: {
        numero: [59, 70],
        dv: [71, 71],
      },
      dvAgConta: [72, 72],
    },
    nome: [73, 102],
  },
  nomeBanco: [103, 132],
  arquivo: {
    codigo: [143, 143],
    dataGeracao: [144, 151],
    horaGeracao: [152, 157],
    sequenciaNsa: [158, 163],
    versaoLayout: [164, 166],
    densidadeGravacao: [167, 171],
  },
  reservadoBanco: [172, 191],
  reservadoEmpresa: [192, 211],
};

StructuresRegistrator.getInstance('complete').registerStructure({
  structure: FILE_HEADER_COMPLETE_STRUCTURE,
  registerType: CnabTipoRegistro.HEADER_ARQUIVO,
});
