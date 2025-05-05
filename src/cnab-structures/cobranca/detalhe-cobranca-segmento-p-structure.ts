import { StructuresRegistrator } from '../../cnab-parser/structures-registrator';

import {
  CnabCodigoSegmentoDetalhe,
  CnabContaCorrente,
  CnabControle,
  CnabRegisterStructure,
  CnabTipoRegistro,
} from '../../types';

export type DetalheCobrancaSegmentoP = {
  controle: CnabControle;
  servico: {
    numeroRegistro: string;
    codigoSegmento: string;
    codigoMovimentoRemessa: string;
  };
  contaCorrente: CnabContaCorrente;
  nossoNumero: string;
  caracteristicaCobranca: {
    codigoCarteira: string;
    formaCadastramento: string;
    tipoDocumento: string;
    idEmissaoBoleto: string;
    idDistribuicaoBoleto: string;
  };
  numeroDocumento: string;
  dataVencimento: string;
  valor: string;
  agenciaCobradora: {
    codigo: string;
    dv: string;
  };
  especieTitulo: string;
  aceiteTitulo: string;
  dataEmissaoTitulo: string;
  juros: {
    codigoJurosMora: string;
    dataJurosMora: string;
    jurosMoraDiaTaxa: string;
  };
  primeiroDesconto: {
    codigoDesconto: string;
    dataDesconto: string;
    valorPercentualDesconto: string;
  };
  valorIOF: string;
  valorAbatimento: string;
  idTituloEmpresa: string;
  codigoProtesto: string;
  prazoProtesto: string;
  codigoBaixaDevolucao: string;
  prazoBaixaDevolucao: string;
  codigoMoeda: string;
  numeroContrato: string;
  livre: string;
};

export const DETALHE_COBRANCA_SEGMENTO_P_STRUCTURE: CnabRegisterStructure<DetalheCobrancaSegmentoP> =
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
    contaCorrente: {
      agencia: {
        codigo: [18, 22],
        dv: [23, 23],
      },
      conta: {
        numero: [24, 35],
        dv: [36, 36],
      },
      dvAgConta: [37, 37],
    },
    nossoNumero: [38, 57],
    caracteristicaCobranca: {
      codigoCarteira: [58, 58],
      formaCadastramento: [59, 59],
      tipoDocumento: [60, 60],
      idEmissaoBoleto: [61, 61],
      idDistribuicaoBoleto: [62, 62],
    },
    numeroDocumento: [63, 77],
    dataVencimento: [78, 85],
    valor: [86, 100],
    agenciaCobradora: {
      codigo: [101, 105],
      dv: [106, 106],
    },
    especieTitulo: [107, 108],
    aceiteTitulo: [109, 109],
    dataEmissaoTitulo: [110, 117],
    juros: {
      codigoJurosMora: [118, 118],
      dataJurosMora: [119, 126],
      jurosMoraDiaTaxa: [127, 141],
    },
    primeiroDesconto: {
      codigoDesconto: [142, 142],
      dataDesconto: [143, 150],
      valorPercentualDesconto: [151, 165],
    },
    valorIOF: [166, 180],
    valorAbatimento: [181, 195],
    idTituloEmpresa: [196, 220],
    codigoProtesto: [221, 221],
    prazoProtesto: [222, 223],
    codigoBaixaDevolucao: [224, 224],
    prazoBaixaDevolucao: [225, 227],
    codigoMoeda: [228, 229],
    numeroContrato: [230, 239],
    livre: [240, 240],
  };

StructuresRegistrator.getInstance().registerStructure({
  structure: DETALHE_COBRANCA_SEGMENTO_P_STRUCTURE,
  registerType: CnabTipoRegistro.DETALHE,
  segmentType: CnabCodigoSegmentoDetalhe.P,
});
