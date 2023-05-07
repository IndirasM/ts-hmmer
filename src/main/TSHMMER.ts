import { FaHandler } from "../file-handling/fa-handler";
import { DataGenerator } from "../generators/data-generator";
import { Simplifier } from "../generators/simplifier";
import { Arguments, Mode } from "../types";

export class TSHMMER {
  constructor() {}

  private dataHandler: FaHandler = new FaHandler();
  private generator: DataGenerator = new DataGenerator();

  async run(): Promise<void> {
    const args: Arguments = this.parseArgs(
      +process.argv[2],
      +process.argv[3],
      process.argv.slice(4)
    );

    let combinedData: string[] = [];
    
    for(let path of args.filePath) {
      const file: string[] = await this.dataHandler.read(path);
      combinedData = combinedData.concat(file);
    }
    
    const filteredFile: string[] = this.dataHandler.filterIncorrectLines(
      combinedData,
      args.readLength
    );

    if (args.mode === Mode.Preparator) {      
      this.dataHandler.writeFilteredFa(filteredFile.slice(0, 250));
    }
    if (args.mode === Mode.Generator) {
      const generatedData: string[] = this.generator.generateData(filteredFile);
      this.dataHandler.writeGeneratedData(generatedData);
    }
    if (args.mode === Mode.Cleanup) {
      const cleaned = Simplifier.cleanFile(filteredFile)
      this.dataHandler.writeFilteredFa(cleaned);
    }
    if (args.mode === Mode.LFA) {
      this.dataHandler.writeFilteredFa(Simplifier.lowercase(filteredFile))
    }
  }

  private parseArgs(readLength: number, mode: number, filePath: string[]): Arguments {
    return {
      filePath,
      readLength,
      mode
    };
  }
}
