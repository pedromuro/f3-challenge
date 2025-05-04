import { registerStructure } from '../../cnab-parser/structures-registrator';

import {
  CnabControle,
  CnabRegisterStructure,
  CnabTipoRegistro,
  CnabTipoServico,
} from '../../types';

export type LoteCobrancaTrailer = {
  controle: CnabControle;
  quantidadeRegistros: string;
  totalCobrancasSimples: {
    quantidadeTitulosCobranca: string;
    valorTotal: string;
  };
  totalCobrancaVinculada: {
    quantidadeTitulosCobranca: string;
    valorTotal: string;
  };
  totalCobrancaCaucionada: {
    quantidadeTitulosCobranca: string;
    quantidadeTitulosCarteiras: string;
  };
  totalCobrancaDescontada: {
    quantidadeTitulosCobranca: string;
    valorTotal: string;
  };
  numeroAviso: string;
};

export type LoteCobrancaTrailerStructure =
  CnabRegisterStructure<LoteCobrancaTrailer>;

const LOTE_COBRANCA_TRAILER_STRUCTURE: LoteCobrancaTrailerStructure = {
  controle: {
    codBanco: [1, 3],
    loteServico: [4, 7],
    tipoRegistro: [8, 8],
  },
  quantidadeRegistros: [18, 23],
  totalCobrancasSimples: {
    quantidadeTitulosCobranca: [24, 29],
    valorTotal: [30, 46],
  },
  totalCobrancaVinculada: {
    quantidadeTitulosCobranca: [47, 52],
    valorTotal: [53, 69],
  },
  totalCobrancaCaucionada: {
    quantidadeTitulosCobranca: [70, 75],
    quantidadeTitulosCarteiras: [76, 92],
  },
  totalCobrancaDescontada: {
    quantidadeTitulosCobranca: [93, 98],
    valorTotal: [99, 115],
  },
  numeroAviso: [116, 123],
};

registerStructure({
  structure: LOTE_COBRANCA_TRAILER_STRUCTURE,
  registerType: CnabTipoRegistro.TRAILER_LOTE,
  serviceType: CnabTipoServico.COBRANCA,
});
