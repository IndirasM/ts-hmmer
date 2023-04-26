import { once } from "events";
import { createReadStream, existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { createInterface, Interface } from "readline";

export class FaModifier {
  constructor() {}

  public async read(): Promise<string[]> {
    const lineMarker: string = "line";
    const closeMarker: string = "close";

    const dataLines: string[] = [];

    try {
      const file: Interface = createInterface({
        input: createReadStream("./data/susceptiblem.fa"),
        crlfDelay: Infinity,
      });

      file.on(lineMarker, (line) => {
        dataLines.push(line);
      });

      await once(file, closeMarker);
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

  public async writeFilteredFa(data: string[]): Promise<void> {
    const fileName: string = "filtered.fa";
    const filePath: string = join("output", fileName);
    const dir = dirname(filePath);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    return writeFileSync(`./${dir}/filtered.fa`, data.join("\n"));
  }

  private filterLine(line: string, lineLength: number): string {
    return line.length === lineLength ? line : "";
  }

  private removeStringsStartingWithGreaterThan(data: string[]): string[] {
    return data.filter((str: string, index: number) => {
      if (str.startsWith(">")) {
        if (data[index + 1]?.startsWith(">")) {
          return false;
        }
      }
      return true;
    });
  }
}
