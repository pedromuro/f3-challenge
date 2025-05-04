import { CnabTipoInscricaoEmpresa, CnabTipoRegistro } from './cnab-enums';

export type CnabControle = {
  codBanco: string;
  loteServico: number;
  tipoRegistro: CnabTipoRegistro;
};

export type CnabContaCorrente = {
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

export type CnabEmpresa = {
  inscricao: {
    tipo: CnabTipoInscricaoEmpresa;
    numero: string;
  };
  convenio: string;
  contaCorrente: CnabContaCorrente;
  nome: string;
};
