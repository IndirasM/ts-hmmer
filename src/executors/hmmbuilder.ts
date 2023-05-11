import { existsSync, mkdirSync, readdirSync } from "fs";
import { execSync } from "node:child_process";
import { dirname, join } from "path";

export class HmmBuilder {
  constructor() {}

  static buildModelsForFiles(): void {
    const outDir = "output"
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
}
