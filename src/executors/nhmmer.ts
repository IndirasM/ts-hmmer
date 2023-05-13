import { execSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { parse } from "path";

export class NHmmer {
  public static runFilteredNhmmer(
    paths: string[],
    runFilter: boolean = false
  ): void {
    const outDir = "output";

    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }

    const hmmdbFile = paths[0];
    const sequencesFile = paths[1];
    const HMMER_RESULTS_FILE = `${outDir}/nhmmer-results-${
      parse(sequencesFile).name
    }.txt`;

    const pressCommand = `hmmpress ${hmmdbFile}`;
    execSync(pressCommand, { encoding: "utf-8" });

    const command = `nhmmer --noali --cpu 8 -o ${HMMER_RESULTS_FILE} ${hmmdbFile} ${sequencesFile}`;
    execSync(command, { encoding: "utf-8" });

    const cleanupCommand = `rm ${hmmdbFile}.*`;
    execSync(cleanupCommand, { encoding: "utf-8" });

    if (runFilter) {
      this.removeNoHitsBlock(HMMER_RESULTS_FILE);
    }
  }

  private static removeNoHitsBlock(filename: string): void {
    const fileContent = readFileSync(filename, "utf-8");

    const initialBlocks = fileContent.split(
      "# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -"
    );
    const headers = initialBlocks[0] + initialBlocks[1];

    const blocks = initialBlocks[2].split("//");
    const filteredBlocks = blocks.filter(
      (block) =>
        !block.includes("No hits detected that satisfy reporting thresholds")
    );

    let updatedContent = filteredBlocks.join("//");

    updatedContent = headers + updatedContent;

    writeFileSync(filename, updatedContent, "utf-8");
  }
}
