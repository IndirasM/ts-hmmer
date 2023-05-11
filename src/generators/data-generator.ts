import { NUCLEOSOME_LENGTH } from "../constants";

export class DataGenerator {
  public generateData(fa: string[]): string[] {
    const outputData: string[] = [];
    let header: string = "";

    for (const str of fa) {
      if (str.startsWith(">")) {
        header = str;
      } else {
        const substrands = this.createSubStrand(str);
        for (const substrand of substrands) {
          outputData.push(header);
          outputData.push(substrand);
        }
      }
    }

    return outputData;
  }

  private createSubStrand(dnaString: string): string[] {
    const subStrands: string[] = [];

    for (let i = 0; i <= dnaString.length - NUCLEOSOME_LENGTH; i++) {
      subStrands.push(dnaString.slice(i, NUCLEOSOME_LENGTH + i));
    }

    return subStrands;
  }
}
