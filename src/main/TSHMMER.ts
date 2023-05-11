import { HmmBuilder } from "../executors/hmmbuilder";
import { FaHandler } from "../file-handling/fa-handler";
import { DataGenerator } from "../generators/data-generator";
import { NameGenerator } from "../generators/name-generator";
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

    if (args.mode === Mode.Preparator) {
      this.dataHandler.writeFa(
        (await this.readFullFa(args)).slice(0, 250)
      );
    }
    if (args.mode === Mode.Generator) {
      const generatedData: string[] = this.generator.generateData(
        await this.readFullFa(args)
      );
      this.dataHandler.writeGeneratedData(generatedData);
    }
    if (args.mode === Mode.Cleanup) {
      const cleaned = Simplifier.cleanFile(await this.readFullFa(args));
      this.dataHandler.writeFa(cleaned);
    }
    if (args.mode === Mode.LFA) {
      this.dataHandler.writeFa(
        Simplifier.lowercase(await this.readFullFa(args))
      );
    }
    if (args.mode === Mode.Split) {
      this.dataHandler.splitAndWrite(await this.readFullFa(args));
      HmmBuilder.buildModelsForFiles();
      HmmBuilder.joinHMMs();
    }
    if (args.mode === Mode.NameSequences) {
      const namedFile = NameGenerator.generateNames(await this.readBasic(args));
      this.dataHandler.writeFa(namedFile, args.filePath[0].split("/").pop());
    }
  }

  private async readBasic(args: Arguments) {
    let combinedData: string[] = [];
    for (let path of args.filePath) {
      const file: string[] = await this.dataHandler.read(path);
      combinedData = combinedData.concat(file);
    }
    return combinedData;
  }

  private async readFullFa(args: Arguments): Promise<string[]> {
    const filteredFile: string[] = this.dataHandler.filterIncorrectLines(
      await this.readBasic(args),
      args.readLength
    );

    return filteredFile;
  }

  private parseArgs(
    readLength: number,
    mode: number,
    filePath: string[]
  ): Arguments {
    return {
      filePath,
      readLength,
      mode,
    };
  }
}
