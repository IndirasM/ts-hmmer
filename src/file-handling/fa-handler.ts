import { once } from "events";
import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  writeFileSync,
} from "fs";
import { dirname, join } from "path";
import { createInterface, Interface } from "readline";
import { CLOSE_MARKER, LINE_MARKER } from "../constants";

export class FaHandler {
  constructor() {}

  public async read(filePath: string): Promise<string[]> {
    const dataLines: string[] = [];

    try {
      const file: Interface = createInterface({
        input: createReadStream(filePath),
        crlfDelay: Infinity,
      });

      file.on(LINE_MARKER, (line: string) => {
        dataLines.push(line);
      });

      await once(file, CLOSE_MARKER);
    } catch (err) {
      console.error(err);
    }
    return dataLines;
  }

  public filterIncorrectLines(lines: string[], lineLength: number): string[] {
    const filteredLines: string[] = lines.filter((line: string) => {
      return line.startsWith(">") ? line : this.filterLine(line, lineLength);
    });

    return this.removeStringsStartingWithGreaterThan(filteredLines);
  }

  public writeFa(data: string[], fileName = "filtered.fa"): void {
    const filePath: string = join("output", fileName);
    const dir = dirname(filePath);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    return writeFileSync(`./${dir}/${fileName}`, data.join("\n"));
  }

  private filterLine(line: string, lineLength: number): string {
    return line.length === lineLength &&
      !line.includes("N") &&
      !line.includes("n")
      ? line
      : "";
  }

  private removeStringsStartingWithGreaterThan(data: string[]): string[] {
    return data.filter((str: string, index: number) => {
      if (str.startsWith(">") && data[index + 1]?.startsWith(">")) {
        return false;
      } else return true;
    });
  }

  filterNonUniques(combinedData: string[]): string[] {
    let newData = new Set(combinedData);
    return [...newData];
  }

  writeGeneratedData(
    data: string[],
    fileName: string = "generated.fa"
  ): Promise<void> {
    const chunkSize = 10000;
    const filePath: string = join("output", fileName);
    const dir = dirname(filePath);

    return new Promise<void>(() => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      const writeStream = createWriteStream(`./${dir}/${fileName}`);

      let i = 0;
      const writeNextChunk = () => {
        while (i < data.length) {
          const chunk = data.slice(i, i + chunkSize);
          i += chunkSize;

          if (!writeStream.write(`${chunk.join("\n")}\n`)) {
            writeStream.once("drain", writeNextChunk);
            return;
          }
        }

        writeStream.end();
      };

      writeNextChunk();
    });
  }

  splitAndWrite(strings: string[]): void {
    const chunkSize = 200;

    for (let i = 0; i < strings.length; i += chunkSize) {
      const chunk = strings.slice(i, i + chunkSize);
      const fileName = `sequence${i / chunkSize}.fa`;
      this.writeSequences(chunk, fileName);
    }
  }

  private writeSequences(data: string[], fileName: string): void {
    const filePath: string = join("output", "sequences");

    if (!existsSync(filePath)) {
      mkdirSync(filePath, { recursive: true });
    }

    return writeFileSync(`./${filePath}/${fileName}`, data.join("\n"));
  }
}
