import { FaModifier } from "../file-handling/fa-handler";
import { DataGenerator } from "../generators/data-generator";
import { Arguments } from "../types";

export class TSHMMER {
  constructor() {}

  private modifier: FaModifier = new FaModifier();
  private generator: DataGenerator = new DataGenerator();

  async run() {
    const args: Arguments = this.parseArgs(+process.argv[2], process.argv.slice(3));

    console.log(args)

    const fullFile: string[] = await this.modifier.read(args.filePath);
    const filteredFile: string[] = this.modifier.filterIncorrectLines(
      fullFile,
      args.readLength
    );

    // this.modifier.writeFilteredFa(filteredFile);

    const generatedData: string[] = this.generator.generateData(filteredFile);
    this.modifier.writeGeneratedData(generatedData);
  }

  private parseArgs(readLength: number, files: string[]): Arguments {
    return {
      filePath: files[0],
      readLength: readLength,
    };
  }
}
