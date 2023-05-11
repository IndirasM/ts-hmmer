export class Helpers {
  public static findMostCommonStringLength(fa: string[]): number {
    const lengthCounts: Map<number, number> = new Map();

    fa.forEach((str: string) => {
      if (!str.startsWith(">")) {
        const length = str.length;
        if (lengthCounts.has(length)) {
          lengthCounts.set(length, lengthCounts.get(length)! + 1);
        } else {
          lengthCounts.set(length, 1);
        }
      }
    });

    let mostCommonLength = 0;
    let maxCount = 0;
    lengthCounts.forEach((count, length) => {
      if (count > maxCount) {
        mostCommonLength = length;
        maxCount = count;
      }
    });

    return mostCommonLength;
  }
}
