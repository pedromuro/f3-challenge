type SummaryValue = {
  valor: string;
  posCnab: {
    linha: number;
    posicao: {
      inicio: number;
      fim: number;
    };
  };
};

export type CnabSummary = {
  bancoBeneficiario: {
    codigo: SummaryValue;
    nome: SummaryValue;
  };
  empresaBeneficiaria: {
    nome: SummaryValue;
    numeroInscricao: SummaryValue;
  };
  empresasPagadoras: {
    nome: SummaryValue;
    numeroInscricao: SummaryValue;
    endereco: SummaryValue;
    bairro: SummaryValue;
    cidade: SummaryValue;
    estado: SummaryValue;
    cep: SummaryValue;
  }[];
};
