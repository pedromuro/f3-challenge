import { userPrompts } from './cli/user-prompts';

import { parseCnabToJson, parseCnabToJsonSummary } from './cnab-parser/parser';

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
    await parseCnabToJson(
      sourceFilePath,
      outputFilePath,
      filtroLinhaInicial,
      filtroLinhaFinal,
      filtroTipoSegmento,
      nomeEmpresaPagadora,
    );
  }

  console.timeEnd('CNAB File Processing');
}

startCli();
