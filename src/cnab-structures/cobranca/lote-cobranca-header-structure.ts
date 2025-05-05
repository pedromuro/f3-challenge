import { StructuresRegistrator } from '../../cnab-parser/structures-registrator';

import {
  CnabLoteHeaderCommons,
  CnabRegisterStructure,
  CnabTipoOperacao,
  CnabTipoRegistro,
  CnabTipoServico,
} from '../../types';

export type LoteCobrancaHeader = CnabLoteHeaderCommons & {
  informacoes: {
    info1: string;
    info2: string;
  };
  controleCobranca: {
    numeroRemessaRetorno: number;
    dataGravacaoRemessaRetorno: string;
  };
  dataCredito: string;
};

export type LoteCobrancaHeaderStructure =
  CnabRegisterStructure<LoteCobrancaHeader>;

const LOTE_COBRANCA_HEADER_STRUCTURE: LoteCobrancaHeaderStructure = {
  controle: {
    codBanco: [1, 3],
    loteServico: [4, 7],
    tipoRegistro: [8, 8],
  },
  servico: {
    operacao: [9, 9, CnabTipoOperacao],
    servico: [10, 11, CnabTipoServico],
    layout: [14, 16],
  },
  empresa: {
    inscricao: {
      tipo: [18, 18],
      numero: [19, 33],
    },
    convenio: [34, 53],
    contaCorrente: {
      agencia: {
        codigo: [54, 58],
        dv: [59, 59],
      },
      conta: {
        numero: [60, 71],
        dv: [72, 72],
      },
      dvAgConta: [73, 73],
    },
    nome: [74, 103],
  },
  informacoes: {
    info1: [104, 143],
    info2: [144, 183],
  },
  controleCobranca: {
    numeroRemessaRetorno: [184, 191],
    dataGravacaoRemessaRetorno: [192, 199],
  },
  dataCredito: [200, 207],
};

StructuresRegistrator.getInstance().registerStructure({
  structure: LOTE_COBRANCA_HEADER_STRUCTURE,
  registerType: CnabTipoRegistro.HEADER_LOTE,
  serviceType: CnabTipoServico.COBRANCA,
});
