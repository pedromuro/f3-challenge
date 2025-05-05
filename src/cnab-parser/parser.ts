import { pipeline } from 'node:stream/promises';

import { loadFile, writeFileStream } from './file-handler';

import { getCnabToJsonFullTransform } from './transformers/cnab-to-json-full.transformer';

import { getCnabToJsonSummaryTransform } from './transformers/cnab-to-json-summary.transformer';

import { Writable } from 'node:stream';

import { CnabSummary } from '../types';

// Buffer do header do lote, usado para extrair o tipo de serviço do header do lote

export async function parseCnabToJson(path: string, outputPath: string) {
  const readStream = loadFile(path);

  const writeStream = writeFileStream(outputPath);

  await pipeline(readStream, getCnabToJsonFullTransform(), writeStream);
}

export async function parseCnabToJsonSummary(path: string, outputPath: string) {
  const readStream = loadFile(path);

  const writeStream = writeFileStream(outputPath);

  let summary: Partial<CnabSummary> = {};

  await pipeline(
    readStream,
    getCnabToJsonSummaryTransform(),
    new Writable({
      write(chunk, encoding, callback) {
        const parsed: Partial<CnabSummary> = JSON.parse(chunk);

        const [empresaPagadoraChunk] = parsed.empresasPagadoras ?? [];

        const alreadyCounted =
          empresaPagadoraChunk &&
          summary?.empresasPagadoras?.some(
            (ep) =>
              ep.numeroInscricao?.valor ===
              empresaPagadoraChunk.numeroInscricao?.valor,
          );

        summary = {
          ...summary,
          ...parsed,
          empresasPagadoras: [
            ...(summary.empresasPagadoras ?? []),
            ...(empresaPagadoraChunk && !alreadyCounted
              ? [empresaPagadoraChunk]
              : []),
          ],
        };

        callback();
      },
    }),
  );

  writeStream.write(JSON.stringify(summary, null, 2));

  writeStream.end();
}
