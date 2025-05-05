import { Transform } from 'stream';

import { CnabCodigoSegmentoDetalhe, CnabTipoRegistro } from '../../types';

import { extractRegisterIdentifiers, parseLine } from '../transformers-commons';

import { DetalheCobrancaSegmentoQ } from '../../cnab-structures/cobranca/detalhe-cobranca-segmento-q-structure';

export const getFilterTransformer = (filters: {
  segmento?: CnabCodigoSegmentoDetalhe;
  nomeEmpresaPagadora?: string;
}) => {
  const normalizedFilterNome = filters.nomeEmpresaPagadora
    ?.trim()
    ?.normalize('NFD')
    ?.replace(/\p{Diacritic}/gu, '');

  return new Transform({
    transform(chunk, encoding, callback) {
      const { registerType, segmentType } = extractRegisterIdentifiers(chunk);

      if (filters.segmento && segmentType !== filters.segmento) {
        callback();

        return;
      }

      if (
        filters.nomeEmpresaPagadora &&
        registerType === CnabTipoRegistro.DETALHE
      ) {
        const { parsed } = parseLine(chunk);

        const { dadosPagador } = parsed.parsed as Pick<
          DetalheCobrancaSegmentoQ,
          'dadosPagador'
        >;

        const normalizedChunkNome = dadosPagador?.nome
          ?.trim()
          ?.normalize('NFD')
          ?.replace(/\p{Diacritic}/gu, '');

        if (
          normalizedChunkNome?.length &&
          normalizedFilterNome?.length &&
          !normalizedChunkNome?.includes(normalizedFilterNome)
        ) {
          callback();

          return;
        }
      }

      callback(null, chunk);
    },
  });
};
