import { HmmBuilder } from "../executors/hmmbuilder";
import { FaHandler } from "../file-handling/fa-handler";
import { DataGenerator } from "../generators/data-generator";
import { NameGenerator } from "../generators/name-generator";
import { Simplifier } from "../generators/simplifier";
import { Arguments, Mode } from "../types";
import { Helpers } from "../utils/helpers";

export class TSHMMER {
  private dataHandler: FaHandler = new FaHandler();
  private generator: DataGenerator = new DataGenerator();

  async run(): Promise<void> {
    const commonReadLength: number = Helpers.findMostCommonStringLength(
      await this.readBasic({ filePath: process.argv.slice(3) } as Arguments)
    );

    const args: Arguments = {
      readLength: commonReadLength,
      mode: +process.argv[2],
      filePath: process.argv.slice(3),
    };

    switch (args.mode) {
      case Mode.Preparator:
        this.dataHandler.writeFa(await this.readFullFa(args));
        break;

      case Mode.Generator:
        const generatedData: string[] = this.generator.generateData(
          await this.readFullFa(args)
        );
        this.dataHandler.writeGeneratedData(generatedData);
        break;

      case Mode.Merge:
        const cleaned: string[] = Simplifier.cleanFile(
          await this.readFullFa(args)
        );
        this.dataHandler.writeFa(cleaned, undefined, false);
        break;

      case Mode.LFA:
        this.dataHandler.writeFa(
          Simplifier.lowercase(await this.readFullFa(args))
        );
        break;

      case Mode.Split:
        this.dataHandler.splitAndWrite(await this.readFullFa(args));
        HmmBuilder.buildModelsForFiles();
        HmmBuilder.joinHMMs();
        break;

      case Mode.NameSequences:
        const namedFile = NameGenerator.generateNames(
          await this.readBasic(args)
        );
        this.dataHandler.writeFa(namedFile, args.filePath[0].split("/").pop());
        break;

      case Mode.UniqueFilter:
        console.warn(
          "WARNING: This filter is not fully implemented and may remove sequences that are not duplicates if the sequence itself is identical but the name is not."
        );
        const file: string[] = await this.readFullFa(args);
        const unique: string[] = this.dataHandler.filterNonUniques(file);
        const filteredUnique: string[] = this.dataHandler.filterIncorrectLines(
          unique,
          args.readLength
        );
        this.dataHandler.writeFa(filteredUnique);

      default:
        break;
    }
  }

  private async readBasic(args: Arguments): Promise<string[]> {
    let combinedData: string[] = [];
    for (let path of args.filePath) {
      const file: string[] = await this.dataHandler.read(path);
      combinedData = combinedData.concat(file);
    }
    return combinedData;
  }

  private async readFullFa(args: Arguments): Promise<string[]> {
    return this.dataHandler.filterIncorrectLines(
      await this.readBasic(args),
      args.readLength
    );
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
