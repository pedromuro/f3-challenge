import { userPrompts } from './cli/user-prompts';

import {
  parseCnabObjectSummary,
  parseCnabToJson,
  parseCnabToJsonSummary,
} from './cnab-parser/parser';

async function startCli() {
  const {
    filtroLinhaFinal,
    filtroLinhaInicial,
    filtroTipoSegmento,
    outputFormat,
    sourceFilePath,
    jsonMode,
    outputFilePath,
    nomeEmpresaPagadora,
  } = await userPrompts();

  console.time('CNAB File Processing');

  if (outputFormat === 'console') {
    const summary = await parseCnabObjectSummary(
      sourceFilePath,
      filtroLinhaInicial,
      filtroLinhaFinal,
      filtroTipoSegmento,
      nomeEmpresaPagadora,
    );

    console.table(summary);

    return;
  }

  if (outputFormat === 'json' && jsonMode === 'summary') {
    await parseCnabToJsonSummary(
      sourceFilePath,
      outputFilePath,
      filtroLinhaInicial,
      filtroLinhaFinal,
      filtroTipoSegmento,
      nomeEmpresaPagadora,
    );

    return;
  }

  if (outputFormat === 'json' && jsonMode === 'complete') {
    await parseCnabToJson(sourceFilePath, outputFilePath);
  }

  console.timeEnd('CNAB File Processing');
}

startCli();
