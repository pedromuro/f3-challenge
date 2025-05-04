import { Transform, TransformCallback, TransformOptions } from 'node:stream';

import { CnabTipoRegistro } from '../../types';

import { parseLine } from '../transformers-commons';

import { StructuresRegistrator } from '../structures-registrator';

export class CnabToJsonFullTransformer extends Transform {
  constructor(options?: TransformOptions) {
    super(options);
  }

  private firstLine = true;

  private currentLoteDetailsCount = 0;

  private isFirstLote = true;

  private readonly register = StructuresRegistrator.getInstance('complete');

  _transform(
    lineChunk: Buffer,
    encoding: BufferEncoding,
    callback: TransformCallback,
  ) {
    const { parsed, registerType } = parseLine(lineChunk, this.register);

    let jsonChunk = '';

    const jsonString = JSON.stringify(parsed, null, 2);

    if (this.firstLine) {
      jsonChunk += '{';

      this.firstLine = false;
    }

    if (registerType === CnabTipoRegistro.HEADER_ARQUIVO) {
      jsonChunk += '"headerArquivo": ';

      jsonChunk += jsonString;

      jsonChunk += ',\n';

      jsonChunk += '"lotes": [\n';
    }

    if (registerType === CnabTipoRegistro.HEADER_LOTE) {
      this.currentLoteDetailsCount = 0;

      if (!this.isFirstLote) {
        jsonChunk += ',\n';
      }

      this.isFirstLote = false;

      jsonChunk += '{\n"headerLote": ';

      jsonChunk += jsonString;

      jsonChunk += ',\n';

      jsonChunk += '"detalhes": [\n';
    }

    if (registerType === CnabTipoRegistro.DETALHE) {
      if (this.currentLoteDetailsCount > 0) {
        jsonChunk += ',\n';
      }

      jsonChunk += jsonString;

      this.currentLoteDetailsCount++;
    }

    if (registerType === CnabTipoRegistro.TRAILER_LOTE) {
      jsonChunk += '],';

      jsonChunk += '"trailerLote": ';

      jsonChunk += jsonString;

      jsonChunk += '}\n';
    }

    if (registerType === CnabTipoRegistro.TRAILER_ARQUIVO) {
      jsonChunk += '],';

      jsonChunk += '"trailerArquivo": ';

      jsonChunk += jsonString;

      jsonChunk += '}\n';
    }

    callback(null, jsonChunk);
  }
}
