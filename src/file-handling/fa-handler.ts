import { once } from "events";
import { createReadStream, existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { createInterface, Interface } from "readline";
import { CLOSE_MARKER, LINE_MARKER } from "../constants";

export class FaModifier {
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
