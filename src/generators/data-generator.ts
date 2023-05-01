export class DataGenerator {
  constructor() {}

  public generateData(arr: string[]): string[] {
    const outputData: string[] = [];
    let header: string = '';

    for (const str of arr) {
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
    const nucleosomeLength = 147;

    for (let i = 0; i <= dnaString.length - nucleosomeLength; i++) {
      subStrands.push(dnaString.substr(i, nucleosomeLength));
    }

    return subStrands;
  }
}
