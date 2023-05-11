export class NameGenerator {
  constructor() {}

  public static generateNames(file: string[]): string[] {
    let counter = 1;

    return file.map((str) => {
      if (str === ">") {
        const updatedHeader = `>${counter}`;
        counter++;
        return updatedHeader;
      }
      return str;
    });
  }
}
