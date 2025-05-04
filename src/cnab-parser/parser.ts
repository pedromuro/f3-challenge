import { pipeline } from 'node:stream/promises';

import { loadFile, writeFileStream } from './file-handler';

import { CnabToJsonFullTransformer } from './transformers/cnab-to-json-full.transformer';

// Buffer do header do lote, usado para extrair o tipo de serviço do header do lote

export async function parseCnabToJson(path: string, outputPath: string) {
  const readStream = loadFile(path);

  const writeStream = writeFileStream(outputPath);

  await pipeline(readStream, new CnabToJsonFullTransformer(), writeStream);
}
