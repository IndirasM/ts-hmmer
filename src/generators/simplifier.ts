export class Simplifier {
  static cleanFile(data: string[]) {
    return data.map((line: string) => line.replace(">", "").replace("\n", ""));
  }

  static lowercase(data: string[]) {
    return data.map((line: string) =>
      line.startsWith(">") ? line : line.toLowerCase()
    );
  }
}
