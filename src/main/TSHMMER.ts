import { FaModifier } from "../file-handling/fa-handler";
import { Arguments } from "../types";

export class TSHMMER {
  constructor() {}

  private modifier = new FaModifier();

  async run() {
    const args = this.parseArgs(process.argv);

    const fullFile: string[] = await this.modifier.read(args.filePath);
    const filteredFile = this.modifier.filterIncorrectLines(
      fullFile,
      args.readLength
    );

    this.modifier.writeFilteredFa(filteredFile);
  }

  private parseArgs(args: string[]): Arguments {
    return {
      filePath: args[3],
      readLength: +args[2],
    };
  }
}
