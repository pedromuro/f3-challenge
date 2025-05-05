import chalk from 'chalk';

import { createReadStream, createWriteStream, statSync } from 'node:fs';

const LINE_LENGTH_BYTES = 240;

const LINE_BREAK_BYTES = 1; // <--- 1 byte do line feed (0x0A) em sistemas Unix/Linux/MacOS.
// Em sistemas Windows, pode ser necessário considerar carriage return + line feed (0x0D 0x0A), portanto, 240 + 2 bytes.

const LINE_LENGTH_BYTES_WITH_LINE_FEED = LINE_LENGTH_BYTES + LINE_BREAK_BYTES;

export function loadFile(path: string, lineStart?: number, lineEnd?: number) {
  const bytesToSkip = lineStart
    ? lineStart * LINE_LENGTH_BYTES_WITH_LINE_FEED
    : 0;

  const maxBytesToRead = lineEnd
    ? lineEnd * LINE_LENGTH_BYTES_WITH_LINE_FEED
    : undefined;

  const lastByteToRead = bytesToSkip
    ? bytesToSkip + (maxBytesToRead ?? 0) - 1
    : undefined;

  const stats = statSync(path, { bigint: true });

  const rStreamOpts = {
    start: bytesToSkip,
    end: lastByteToRead,
  };

  const fstream = createReadStream(path, rStreamOpts);

  let onReadyTimestamp: number;

  fstream.on('readable', () => {
    while (fstream.read(LINE_LENGTH_BYTES_WITH_LINE_FEED)) {
      void 0;
    }
  });

  fstream.on('ready', () => {
    onReadyTimestamp = Date.now();

    const totalBytes = maxBytesToRead ?? Number(stats.size);

    const megaBytes = (totalBytes / 1024 / 1024).toFixed(2);

    console.log(
      `${chalk.green('Processando')} ${chalk.italic.bold.bgBlack(
        `${megaBytes} MB`,
      )}`,
    );
  });

  const totalBytes = Buffer.alloc(8);

  fstream.on('data', (chunk: string | Buffer) => {
    if (typeof chunk === 'object') {
      process.nextTick(() => {
        const bytes = totalBytes.readUInt32LE(0);

        totalBytes.writeUInt32LE(bytes + chunk.length, 0);

        const currentPercentage =
          (Number(totalBytes.readUInt32LE(0)) * 100) / Number(stats.size);

        const duration = Date.now() - onReadyTimestamp;

        process.stdout.write(
          `${chalk.green('Processando')} ${chalk.italic.bold.bgBlack(
            `${currentPercentage.toFixed(2)}% ${
              duration > 1000
                ? `${(duration / 1000).toFixed(2)}s`
                : `${duration}ms`
            }`,
          )}\r`,
        );
      });
    }
  });

  return fstream;
}

export function writeFileStream(path: string) {
  const fstream = createWriteStream(path);

  return fstream;
}
