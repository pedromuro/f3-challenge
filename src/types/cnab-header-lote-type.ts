import {
  CnabFormaLancamento,
  CnabTipoOperacao,
  CnabTipoServico,
} from './cnab-enums';

import { CnabControle, CnabEmpresa } from './common-cnab-types';

export type CnabLoteHeaderCommons = {
  controle: CnabControle;
  servico: {
    operacao: CnabTipoOperacao;
    servico: CnabTipoServico;
    formaLancamento?: CnabFormaLancamento;
    layout: string;
  };
  empresa: CnabEmpresa;
};
