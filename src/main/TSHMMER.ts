import { FaHandler } from "../file-handling/fa-handler";
import { DataGenerator } from "../generators/data-generator";
import { Arguments } from "../types";

export class TSHMMER {
  constructor() {}

  private dataHandler: FaHandler = new FaHandler();
  private generator: DataGenerator = new DataGenerator();

  async run() {
    const args: Arguments = this.parseArgs(
      +process.argv[2],
      process.argv.slice(3)
    );

    const fullFile: string[] = await this.dataHandler.read(args.filePath);
    const filteredFile: string[] = this.dataHandler.filterIncorrectLines(
      fullFile,
      args.readLength
    );

    this.dataHandler.writeFilteredFa(filteredFile);

    const generatedData: string[] = this.generator.generateData(filteredFile);

    this.dataHandler.writeGeneratedData(generatedData);
  }

  private parseArgs(readLength: number, files: string[]): Arguments {
    return {
      filePath: files[0],
      readLength: readLength,
    };
  }
}
