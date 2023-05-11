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
    const sequencesDir = join(outDir, "sequences");

    if (!existsSync(modelsDir)) {
      mkdirSync(modelsDir, { recursive: true });
    }

    const files = readdirSync(sequencesDir);

    files.forEach((file, index) => {
      const sequence = file;
      const model = `model${index}.hmm`;

      const command = `hmmbuild models/${model} sequences/${sequence}`;
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
}
