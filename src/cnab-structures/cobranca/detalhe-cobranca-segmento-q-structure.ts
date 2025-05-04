import { registerStructure } from '../../cnab-parser/structures-registrator';

import {
  CnabCodigoSegmentoDetalhe,
  CnabControle,
  CnabRegisterStructure,
  CnabTipoRegistro,
} from '../../types';

export type DetalheCobrancaSegmentoQ = {
  controle: CnabControle;
  servico: {
    numeroRegistro: string;
    codigoSegmento: string;
    codigoMovimentoRemessa: string;
  };
  dadosPagador: {
    inscricao: {
      tipo: string;
      numero: string;
    };
    nome: string;
    endereco: string;
    bairro: string;
    cep: string;
    sufixoCep: string;
    cidade: string;
    uf: string;
  };
  sacadorAvalista: {
    inscricao: {
      tipo: string;
      numero: string;
    };
    nome: string;
  };
  bancoCorrespondente: string;
  nossoNumeroBancoCorrespondente: string;
};

export const DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE: CnabRegisterStructure<DetalheCobrancaSegmentoQ> =
  {
    controle: {
      codBanco: [1, 3],
      loteServico: [4, 7],
      tipoRegistro: [8, 8],
    },
    servico: {
      numeroRegistro: [9, 13],
      codigoSegmento: [14, 14],
      codigoMovimentoRemessa: [16, 17],
    },
    dadosPagador: {
      inscricao: {
        tipo: [18, 18],
        numero: [19, 33],
      },
      nome: [34, 73],
      endereco: [74, 113],
      bairro: [114, 128],
      cep: [129, 133],
      sufixoCep: [134, 136],
      cidade: [137, 151],
      uf: [152, 153],
    },
    sacadorAvalista: {
      inscricao: {
        tipo: [154, 154],
        numero: [155, 169],
      },
      nome: [170, 209],
    },
    bancoCorrespondente: [210, 212],
    nossoNumeroBancoCorrespondente: [213, 232],
  };

registerStructure({
  structure: DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE,
  registerType: CnabTipoRegistro.DETALHE,
  segmentType: CnabCodigoSegmentoDetalhe.Q,
});
