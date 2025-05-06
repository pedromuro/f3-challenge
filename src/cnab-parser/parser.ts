import { pipeline } from 'node:stream/promises';

import { loadFile, writeFileStream } from './file-handler';

import { getCnabToJsonFullTransform } from './transformers/cnab-to-json-full.transformer';

import { getCnabToSummaryTransform } from './transformers/cnab-to-summary.transformer';

import { Writable } from 'node:stream';

import { CnabCodigoSegmentoDetalhe, CnabSummary } from '../types';

import { getFilterTransformer } from './transformers/filter.transformer';

import { table } from 'table';

import chalk from 'chalk';

export async function parseCnabToJson(path: string, outputPath: string) {
  const readStream = loadFile(path);

  const writeStream = writeFileStream(outputPath);

  await pipeline(readStream, getCnabToJsonFullTransform(), writeStream);
}

export async function parseCnabToJsonSummary(
  path: string,
  outputPath: string,
  lineStart?: number,
  lineEnd?: number,
  segmento?: CnabCodigoSegmentoDetalhe,
  nomeEmpresaPagadora?: string,
) {
  const readStream = loadFile(path, lineStart, lineEnd);

  const writeStream = writeFileStream(outputPath);

  let summary: Partial<CnabSummary> = {};

  await pipeline(
    readStream,
    getFilterTransformer({ segmento, nomeEmpresaPagadora }),
    getCnabToSummaryTransform(),
    new Writable({
      write(chunk, encoding, callback) {
        summary = JSON.parse(chunk);

        callback();
      },
    }),
  );

  writeStream.write(JSON.stringify(summary, null, 2));

  writeStream.end();
}

export async function parseCnabObjectSummary(
  path: string,
  lineStart?: number,
  lineEnd?: number,
  segmento?: CnabCodigoSegmentoDetalhe,
  nomeEmpresaPagadora?: string,
) {
  const readStream = loadFile(path, lineStart, lineEnd);

  let tableRows: (string | number)[][] = [];

  await pipeline(
    readStream,
    getFilterTransformer({ segmento, nomeEmpresaPagadora }),
    getCnabToSummaryTransform(),
    new Writable({
      write(chunk, encoding, callback) {
        const summary: Partial<CnabSummary> = JSON.parse(chunk);

        if (summary.bancoBeneficiario) {
          const { codigo, nome } = summary.bancoBeneficiario;

          tableRows.push([
            'Banco',
            codigo.valor,
            codigo.posCnab.linha,
            codigo.posCnab.posicao.inicio,
            codigo.posCnab.posicao.fim,
            nome.valor,
            nome.posCnab.linha,
            nome.posCnab.posicao.inicio,
            nome.posCnab.posicao.fim,
          ]);
        }

        if (summary.empresaBeneficiaria) {
          const { numeroInscricao, nome } = summary.empresaBeneficiaria;

          tableRows.push([
            'Beneficiária',
            numeroInscricao.valor,
            numeroInscricao.posCnab.linha,
            numeroInscricao.posCnab.posicao.inicio,
            numeroInscricao.posCnab.posicao.fim,
            nome.valor,
            nome.posCnab.linha,
            nome.posCnab.posicao.inicio,
            nome.posCnab.posicao.fim,
          ]);
        }

        if (summary.empresasPagadoras) {
          const [empresa] = summary.empresasPagadoras;

          const { numeroInscricao, nome, endereco, bairro, cidade, estado } =
            empresa;

          tableRows.push([
            'Pagadora',
            numeroInscricao.valor,
            numeroInscricao.posCnab.linha,
            numeroInscricao.posCnab.posicao.inicio,
            numeroInscricao.posCnab.posicao.fim,
            nome.valor,
            nome.posCnab.linha,
            nome.posCnab.posicao.inicio,
            nome.posCnab.posicao.fim,
            endereco.valor,
            endereco.posCnab.linha,
            endereco.posCnab.posicao.inicio,
            endereco.posCnab.posicao.fim,
            bairro.valor,
            bairro.posCnab.linha,
            bairro.posCnab.posicao.inicio,
            bairro.posCnab.posicao.fim,
            cidade.valor,
            cidade.posCnab.linha,
            cidade.posCnab.posicao.inicio,
            cidade.posCnab.posicao.fim,
            estado.valor,
            estado.posCnab.linha,
            estado.posCnab.posicao.inicio,
            estado.posCnab.posicao.fim,
          ]);
        }

        callback();
      },
    }),
  );

  let headerCols: string[] = [
    'Tipo',
    'Inscrição/Código',
    'Nome da Empresa',
    'Endereço',
    'Bairro',
    'Cidade',
    'Estado',
  ];

  const [, ...restHeaderCols] = headerCols;

  const subHeaderCols: string[] = restHeaderCols.flatMap(() => [
    'V:',
    'L:',
    'I:',
    'F:',
  ]);

  headerCols = restHeaderCols.flatMap((col) => [col, '', '', '']);

  tableRows = tableRows.map((row) => {
    while (row.length <= headerCols.length) {
      row.push('');
    }

    return row;
  });

  const spanningCells = [];

  const columns: Record<number, { width: number }> = {};

  for (let i = 0; i < headerCols.length; ) {
    if (i === 0) {
      i++;

      continue;
    }

    spanningCells.push({
      col: i,
      row: 0,
      colSpan: 4,
    });

    columns[i] = {
      width: 8,
    };

    i += 4;
  }

  console.log(
    table([['', ...headerCols], ['', ...subHeaderCols], ...tableRows], {
      spanningCells,
      columns,
      columnDefault: {
        width: 3,
      },
    }),
  );

  console.log(`Legenda:
    ${chalk.green('V:')} Valor
    ${chalk.green('L:')} Linha do registro
    ${chalk.green('I:')} Coluna inicial
    ${chalk.green('F:')} Coluna final
  `);
}
