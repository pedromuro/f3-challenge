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

export const getCnabToJsonSummaryTransform = (): Transform => {
  let linesCount = 0;

  return new Transform({
    transform(
      lineChunk: Buffer,
      enc: BufferEncoding,
      callback: TransformCallback,
    ) {
      const summary: Partial<CnabSummary> = {};

      summary.empresasPagadoras = [];

      linesCount++;

      const { parsed, registerType } = parseLine(lineChunk);

      if (registerType === CnabTipoRegistro.HEADER_ARQUIVO) {
        const headerArquivo = parsed as CnabHeader;

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
                inicio:
                  FILE_HEADER_COMPLETE_STRUCTURE.empresa.inscricao.numero[0],
                fim: FILE_HEADER_COMPLETE_STRUCTURE.empresa.inscricao.numero[1],
              },
            },
          },
        };

        callback(null, JSON.stringify(summary, null, 2));

        return;
      }

      const isDetalhe = registerType === CnabTipoRegistro.DETALHE;

      if (isDetalhe) {
        const { servico } = parsed as { servico: { codigoSegmento: string } };

        if (servico.codigoSegmento === CnabCodigoSegmentoDetalhe.Q) {
          const { dadosPagador } = parsed as DetalheCobrancaSegmentoQ;

          summary.empresasPagadoras?.push({
            nome: {
              valor: dadosPagador.nome,
              posCnab: {
                linha: linesCount,
                posicao: {
                  inicio:
                    DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador.nome[0],
                  fim: DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador
                    .nome[1],
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
                  fim: DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador
                    .inscricao.numero[1],
                },
              },
            },
            endereco: {
              valor: dadosPagador.endereco,
              posCnab: {
                linha: linesCount,
                posicao: {
                  inicio:
                    DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador
                      .endereco[0],
                  fim: DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador
                    .endereco[1],
                },
              },
            },
            bairro: {
              valor: dadosPagador.bairro,
              posCnab: {
                linha: linesCount,
                posicao: {
                  inicio:
                    DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador
                      .bairro[0],
                  fim: DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador
                    .bairro[1],
                },
              },
            },
            cidade: {
              valor: dadosPagador.cidade,
              posCnab: {
                linha: linesCount,
                posicao: {
                  inicio:
                    DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador
                      .cidade[0],
                  fim: DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador
                    .cidade[1],
                },
              },
            },
            estado: {
              valor: dadosPagador.uf,
              posCnab: {
                linha: linesCount,
                posicao: {
                  inicio:
                    DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador.uf[0],
                  fim: DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador.uf[1],
                },
              },
            },
            cep: {
              valor: dadosPagador.cep,
              posCnab: {
                linha: linesCount,
                posicao: {
                  inicio:
                    DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador.cep[0],
                  fim: DETALHE_COBRANCA_SEGMENTO_Q_STRUCTURE.dadosPagador
                    .cep[1],
                },
              },
            },
          });
        }
      }

      callback(null, JSON.stringify(summary, null, 2));
    },
  });
};
