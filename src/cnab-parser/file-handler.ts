import { createReadStream, createWriteStream } from 'node:fs';

const LINE_LENGTH_BYTES = 240;

const LINE_BREAK_BYTES = 1; // <--- 1 byte do line feed (0x0A) em sistemas Unix/Linux/MacOS.
// Em sistemas Windows, pode ser necessário considerar carriage return + line feed (0x0D 0x0A), portanto, 240 + 2 bytes.

const LINE_LENGTH_BYTES_WITH_LINE_FEED = LINE_LENGTH_BYTES + LINE_BREAK_BYTES;

export function loadFile(path: string) {
  const fstream = createReadStream(path);

  fstream.on('readable', () => {
    while (fstream.read(LINE_LENGTH_BYTES_WITH_LINE_FEED)) {
      void 0;
    }
  });

  return fstream;
}

export function writeFileStream(path: string) {
  const fstream = createWriteStream(path);

  return fstream;
}
