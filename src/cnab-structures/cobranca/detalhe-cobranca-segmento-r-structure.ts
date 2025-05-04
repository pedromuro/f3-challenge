import { StructuresRegistrator } from '../../cnab-parser/structures-registrator';

import {
  CnabCodigoSegmentoDetalhe,
  CnabControle,
  CnabRegisterStructure,
  CnabTipoRegistro,
} from '../../types';

export type DetalheCobrancaSegmentoR = {
  controle: CnabControle;
  servico: {
    numeroRegistro: string;
    codigoSegmento: string;
    codigoMovimentoRemessa: string;
  };
  segundoDesconto: {
    codigoDesconto: string;
    dataDesconto: string;
    valorPercentualDesconto: string;
  };
  terceiroDesconto: {
    codigoDesconto: string;
    dataDesconto: string;
    valorPercentualDesconto: string;
  };
  multa: {
    codigoMulta: string;
    dataMulta: string;
    valorPercentualMulta: string;
  };
  informacaoAoPagador: string;
  informacoes: {
    info3: string;
    info4: string;
  };
  codigoOcorrenciaPagador: string;
  dadosParaDebito: {
    codBanco: string;
    agencia: {
      codigo: string;
      dv: string;
    };
    conta: {
      numero: string;
      dv: string;
    };
    dvAgConta: string;
  };
  idAvisoDebitoAutomatico: string;
};

export const DETALHE_COBRANCA_SEGMENTO_R_STRUCTURE: CnabRegisterStructure<DetalheCobrancaSegmentoR> =
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
    segundoDesconto: {
      codigoDesconto: [18, 18],
      dataDesconto: [19, 26],
      valorPercentualDesconto: [27, 41],
    },
    terceiroDesconto: {
      codigoDesconto: [42, 42],
      dataDesconto: [43, 50],
      valorPercentualDesconto: [51, 65],
    },
    multa: {
      codigoMulta: [66, 66],
      dataMulta: [67, 74],
      valorPercentualMulta: [75, 89],
    },
    informacaoAoPagador: [90, 99],
    informacoes: {
      info3: [100, 139],
      info4: [140, 179],
    },
    codigoOcorrenciaPagador: [200, 207],
    dadosParaDebito: {
      codBanco: [208, 210],
      agencia: {
        codigo: [211, 215],
        dv: [216, 216],
      },
      conta: {
        numero: [217, 228],
        dv: [229, 229],
      },
      dvAgConta: [230, 230],
    },
    idAvisoDebitoAutomatico: [231, 231],
  };

StructuresRegistrator.getInstance('complete').registerStructure({
  structure: DETALHE_COBRANCA_SEGMENTO_R_STRUCTURE,
  registerType: CnabTipoRegistro.DETALHE,
  segmentType: CnabCodigoSegmentoDetalhe.R,
});
