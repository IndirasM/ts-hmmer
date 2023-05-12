export class Simplifier {
  static cleanFile(data: string[]): string[] {
    return data.map((line: string) => {
      return !line.startsWith(">") ? `${line}\n` : "";
    });
  }

  static lowercase(data: string[]): string[] {
    return data.map((line: string) =>
      line.startsWith(">") ? line : line.toLowerCase()
    );
  }

  static shortenSequences(fa: string[]): string[] {
    return fa.map((line: string) =>
      line.startsWith(">") ? line : this.getMiddleNucleotides(line)
    );
  }

  private static getMiddleNucleotides(sequence: string): string {
    const middleIndex: number = Math.floor(sequence.length / 2);
    const startIndex: number = Math.max(0, middleIndex - 70);
    const endIndex: number = Math.min(sequence.length, middleIndex + 70);
    return sequence.substring(startIndex, endIndex);
  }
}
