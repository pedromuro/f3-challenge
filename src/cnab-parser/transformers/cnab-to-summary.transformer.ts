import { Transform, TransformCallback } from 'node:stream';

import { parseLine } from '../transformers-commons';

import {
  CnabCodigoSegmentoDetalhe,
  CnabSummary,
  CnabTipoRegistro,
} from '../../types';

import {
  CnabHeader,
  FILE_HEADER_COMPLETE_STRUCTURE,
} from '../../cnab-structures/file-header-structure';

import {
  DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE,
  DetalheCobrancaSegmentoQ,
} from '../../cnab-structures/cobranca/detalhe-cobranca-segmento-q-structure';

const extractFromFileHeader = (
  parsedChunk: Record<string, unknown>,
  registerType: CnabTipoRegistro,
  linesCount: number,
): Partial<CnabSummary> => {
  const summary: Partial<CnabSummary> = {};

  if (registerType === CnabTipoRegistro.HEADER_ARQUIVO) {
    const headerArquivo = parsedChunk as CnabHeader;

    summary.bancoBeneficiario = {
      codigo: {
        valor: headerArquivo.controle.codBanco,
        posCnab: {
          linha: linesCount,
          posicao: {
            inicio: FILE_HEADER_COMPLETE_STRUCTURE.controle.codBanco[0],
            fim: FILE_HEADER_COMPLETE_STRUCTURE.controle.codBanco[1],
          },
        },
      },
      nome: {
        valor: headerArquivo.nomeBanco,
        posCnab: {
          linha: linesCount,
          posicao: {
            inicio: FILE_HEADER_COMPLETE_STRUCTURE.nomeBanco[0],
            fim: FILE_HEADER_COMPLETE_STRUCTURE.nomeBanco[1],
          },
        },
      },
    };

    summary.empresaBeneficiaria = {
      nome: {
        valor: headerArquivo.empresa.nome,
        posCnab: {
          linha: linesCount,
          posicao: {
            inicio: FILE_HEADER_COMPLETE_STRUCTURE.empresa.nome[0],
            fim: FILE_HEADER_COMPLETE_STRUCTURE.empresa.nome[1],
          },
        },
      },
      numeroInscricao: {
        valor: headerArquivo.empresa.inscricao.numero,
        posCnab: {
          linha: linesCount,
          posicao: {
            inicio: FILE_HEADER_COMPLETE_STRUCTURE.empresa.inscricao.numero[0],
            fim: FILE_HEADER_COMPLETE_STRUCTURE.empresa.inscricao.numero[1],
          },
        },
      },
    };
  }

  return summary;
};

const extractFromDetail = (
  parsedChunk: Record<string, unknown>,
  registerType: CnabTipoRegistro,
  linesCount: number,
): Partial<CnabSummary> => {
  const summary: Partial<CnabSummary> = {};

  summary.empresasPagadoras = [];

  const isDetalhe = registerType === CnabTipoRegistro.DETALHE;

  const { servico } = parsedChunk as { servico: { codigoSegmento: string } };

  if (isDetalhe && servico.codigoSegmento === CnabCodigoSegmentoDetalhe.Q) {
    const { dadosPagador } = parsedChunk as DetalheCobrancaSegmentoQ;

    summary.empresasPagadoras?.push({
      nome: {
        valor: dadosPagador.nome,
        posCnab: {
          linha: linesCount,
          posicao: {
            inicio: DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador.nome[0],
            fim: DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador.nome[1],
          },
        },
      },
      numeroInscricao: {
        valor: dadosPagador.inscricao.numero,
        posCnab: {
          linha: linesCount,
          posicao: {
            inicio:
              DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador.inscricao
                .numero[0],
            fim: DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador.inscricao
              .numero[1],
          },
        },
      },
      endereco: {
        valor: dadosPagador.endereco,
        posCnab: {
          linha: linesCount,
          posicao: {
            inicio:
              DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador.endereco[0],
            fim: DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador.endereco[1],
          },
        },
      },
      bairro: {
        valor: dadosPagador.bairro,
        posCnab: {
          linha: linesCount,
          posicao: {
            inicio:
              DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador.bairro[0],
            fim: DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador.bairro[1],
          },
        },
      },
      cidade: {
        valor: dadosPagador.cidade,
        posCnab: {
          linha: linesCount,
          posicao: {
            inicio:
              DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador.cidade[0],
            fim: DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador.cidade[1],
          },
        },
      },
      estado: {
        valor: dadosPagador.uf,
        posCnab: {
          linha: linesCount,
          posicao: {
            inicio: DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador.uf[0],
            fim: DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador.uf[1],
          },
        },
      },
      cep: {
        valor: dadosPagador.cep,
        posCnab: {
          linha: linesCount,
          posicao: {
            inicio: DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador.cep[0],
            fim: DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador.cep[1],
          },
        },
      },
    });
  }

  return summary;
};

export const getCnabToSummaryTransform = (): Transform => {
  let linesCount = 0;

  const summarySentControl: {
    [k in keyof CnabSummary]?: boolean;
  } = {};

  const empresasPagadorasSentControl: string[] = [];

  return new Transform({
    transform(
      lineChunk: Buffer,
      enc: BufferEncoding,
      callback: TransformCallback,
    ) {
      linesCount++;

      const { parsed, registerType } = parseLine(lineChunk);

      const fromFileHeader = extractFromFileHeader(
        parsed,
        registerType,
        linesCount,
      );

      if (fromFileHeader) {
        const { bancoBeneficiario, empresaBeneficiaria } = fromFileHeader ?? {};

        if (!summarySentControl.bancoBeneficiario && bancoBeneficiario) {
          this.push(
            JSON.stringify(<Pick<CnabSummary, 'bancoBeneficiario'>>{
              bancoBeneficiario,
            }),
          );

          summarySentControl.bancoBeneficiario = true;
        }

        if (!summarySentControl.empresaBeneficiaria && empresaBeneficiaria) {
          this.push(
            JSON.stringify(<Pick<CnabSummary, 'empresaBeneficiaria'>>{
              empresaBeneficiaria,
            }),
          );

          summarySentControl.empresaBeneficiaria = true;
        }
      }

      const fromDetail =
        extractFromDetail(parsed, registerType, linesCount) ?? {};

      const { empresasPagadoras } = fromDetail;

      const [empresa] = empresasPagadoras ?? []; //apenas uma empresa pode ser extraida do segmento Q

      if (empresa) {
        const alreadyCounted = empresasPagadorasSentControl.includes(
          empresa?.numeroInscricao?.valor,
        );

        if (!alreadyCounted) {
          this.push(
            JSON.stringify(<Pick<CnabSummary, 'empresasPagadoras'>>{
              empresasPagadoras: [empresa],
            }),
          );

          empresasPagadorasSentControl.push(empresa?.numeroInscricao?.valor);
        }
      }

      callback();
    },
  });
};
