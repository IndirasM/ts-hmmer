export class Simplifier {
  constructor() {}

  static cleanFile(data: string[]) {
    return data.map((line) => line.replace(">", "").replace("\n", ""));
  }

  static lowercase(data: string[]) {
    return data.map((line) =>
      line.startsWith(">") ? line : line.toLowerCase()
    );
  }
}
