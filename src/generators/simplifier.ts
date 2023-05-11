export class Simplifier {
  static cleanFile(data: string[]) {
    return data.map((line: string) => {
      return !line.startsWith(">") ? `${line}\n` : ""
    });
  }

  static lowercase(data: string[]) {
    return data.map((line: string) =>
      line.startsWith(">") ? line : line.toLowerCase()
    );
  }
}
