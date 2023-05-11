export class NameGenerator {
  public static generateNames(file: string[]): string[] {
    let counter: number = 1;

    return file.map((str: string) => {
      if (str === ">") {
        const updatedHeader: string = `>${counter}`;
        counter++;
        return updatedHeader;
      }
      return str;
    });
  }
}
