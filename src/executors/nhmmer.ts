import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

export class NHmmer {
    public static runFilteredNhmmer(paths: string[]): void {
        const hmmdbFile = paths[0];
        const sequencesFile = paths[1];
        const HMMER_RESULTS_FILE = 'output/nhmmer-results.txt';
        const command = `nhmmer -o ${HMMER_RESULTS_FILE} ${hmmdbFile} ${sequencesFile}`;
        execSync(command, { encoding: 'utf-8' });
        this.removeNoHitsBlock(HMMER_RESULTS_FILE);
    }

    private static removeNoHitsBlock(filename: string): void {
        const fileContent = readFileSync(filename, 'utf-8');

        const initialBlocks = fileContent.split('# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
        const headers = initialBlocks[0] + initialBlocks[1];
      
        const blocks = initialBlocks[2].split('//');
        const filteredBlocks = blocks.filter((block) => !block.includes('No hits detected that satisfy reporting thresholds'));
      
        let updatedContent = filteredBlocks.join('//');

        updatedContent = headers + updatedContent;
        
        writeFileSync(filename, updatedContent, 'utf-8');
      }
}