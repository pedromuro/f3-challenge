import path from 'path';

import prompts from 'prompts';

import { CnabCodigoSegmentoDetalhe } from '../types';

export const userPrompts = async () => {
  return await prompts([
    {
      type: 'text',
      name: 'sourceFilePath',
      message:
        'Selecione o arquivo CNAB 240 de entrada (pressione Enter para usar o exemplo)',
      initial: path.relative(
        process.cwd(),
        path.resolve(__dirname, '../../cnabExample.rem'),
      ),
    },
    {
      type: 'select',
      name: 'outputFormat',
      message: 'Selecione o formato de saída',
      choices: [
        {
          title: 'JSON',
          value: 'json',
          description:
            'Os dados serão escritos no arquivo de saída em formato JSON',
        },
        {
          title: 'Console',
          value: 'console',
          description:
            'Os dados serão escritos no console, formatados em tabela',
        },
      ],
    },
    {
      type: (_, value) => (value.outputFormat === 'json' ? 'select' : null),
      name: 'jsonMode',
      message: 'Selecione o modo de saída JSON',
      choices: [
        {
          title: 'Completo',
          value: 'complete',
          description:
            'Todos os dados serão escritos no arquivo de saída, linha por linha',
        },
        {
          title: 'Sumarizado',
          value: 'summary',
          description:
            'Apenas os dados sumarizados serão escritos no arquivo de saída',
        },
      ],
    },
    {
      type: (_, value) => (value.outputFormat === 'json' ? 'text' : null),
      name: 'outputFilePath',
      message: 'Selecione o arquivo de saída',
      initial: path.relative(
        process.cwd(),
        path.resolve(__dirname, '../../output.json'),
      ),
    },
    {
      type: (_, values) => {
        if (values.outputFormat === 'json' && values.jsonMode === 'complete')
          return null;

        return 'select';
      },
      name: 'useFilters',
      message: 'Deseja aplicar filtros ao processamento do arquivo?',
      choices: [
        {
          title: 'Não',
          value: false,
        },
        {
          title: 'Sim',
          value: true,
        },
      ],
    },
    {
      type: (_, values) => (values.useFilters ? 'select' : null),
      name: 'filtroTipoSegmento',
      message: 'Selecione o segmento a ser filtrado',
      choices: [
        {
          title: 'Nenhum',
          value: null,
        },
        {
          title: 'Segmento P  ',
          value: CnabCodigoSegmentoDetalhe.P,
        },
        {
          title: 'Segmento Q',
          value: CnabCodigoSegmentoDetalhe.Q,
        },
        {
          title: 'Segmento R',
          value: CnabCodigoSegmentoDetalhe.R,
        },
      ],
    },
    {
      type: (_, values) => {
        if (values.jsonMode === 'complete') return null;

        if (!values.useFilters) return null;

        return 'select';
      },
      name: 'useRangeFilters',
      message: 'Deseja selecionar um intervalo de linhas para filtrar?',
      choices: [
        {
          title: 'Não',
          value: false,
        },
        {
          title: 'Sim',
          value: true,
        },
      ],
    },
    {
      type: (_, values) => (values.useRangeFilters ? 'number' : null),
      name: 'filtroLinhaInicial',
      message: 'Selecione a linha inicial a ser filtrada',
      hint: 'A linha inicial é o número da linha que deseja iniciar a leitura do arquivo',
      min: 1,
    },
    {
      type: (_, values) => (values.useRangeFilters ? 'number' : null),
      name: 'filtroLinhaFinal',
      message: 'Selecione a linha final a ser filtrada',
      hint: 'A linha final é o número da linha que deseja finalizar a leitura do arquivo',
      min: (_, values) => values.filtroLinhaInicial,
    },
    {
      type: (_, values) => (values.useFilters ? 'text' : null),
      name: 'nomeEmpresaPagadora',
      message: 'Pesquise por nome da empresa pagadora',
      hint: 'Preencha com o nome da empresa pagadora para filtrar os dados. Caso não tenha, deixe em branco.',
    },
  ]);
};
