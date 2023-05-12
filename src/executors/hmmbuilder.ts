import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
} from "fs";
import { execSync } from "node:child_process";
import { join } from "path";

export class HmmBuilder {
  constructor() {}

  static buildModelsForFiles(): void {
    const outDir = "output";
    const modelsDir = join(outDir, "models");
    const alignmentsDir = join(outDir, "alignments");

    if (!existsSync(modelsDir)) {
      mkdirSync(modelsDir, { recursive: true });
    }

    const files = readdirSync(alignmentsDir);

    files.forEach((file, index) => {
      const alignment = file;
      const model = `model${index}.hmm`;

      const command = `hmmbuild models/${model} alignments/${alignment}`;
      execSync(command, { cwd: outDir, encoding: "utf-8" });
    });
  }

  static joinHMMs(): void {
    const MODEL_PATH = join("output", "models");
    const HMM_DB = join("output", "hmm_db.hmm");
    const files = readdirSync(MODEL_PATH);
    const outputStream = createWriteStream(HMM_DB);

    files.forEach((file) => {
      const filePath = `${MODEL_PATH}/${file}`;
      const fileContents = readFileSync(filePath);
      outputStream.write(fileContents);
    });

    outputStream.end();
  }

  public static alignFasta(useOlder: boolean = false) {
    const outDir = "output";
    const sequencesDir = join(outDir, "sequences");
    const alignmentsDir = join(outDir, "alignments");
  
    if (!existsSync(alignmentsDir)) {
      mkdirSync(alignmentsDir, { recursive: true });
    }

    const files = readdirSync(sequencesDir);

    files.forEach((file, index) => {
      const sequence = file;
      const alignment = `alignment${index}.fa`;

      const commandClustalW = `clustalw -type=DNA -quicktree -output=FASTA -outfile=alignments/${alignment} -outorder=ALIGNED -quiet -align -infile=sequences/${sequence}`;
      const commandClustalO = `clustalo -i sequences/${sequence} -t DNA --infmt=fa -o alignments/${alignment} --outfmt=fa --threads=8 --force`;
      execSync(useOlder? commandClustalW : commandClustalO, { cwd: outDir, encoding: "utf-8" });
    });
  }
}
