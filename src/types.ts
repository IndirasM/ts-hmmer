export interface Arguments {
  filePath: string[];
  readLength: number;
  mode: Mode
}




export enum Mode {
  Generator,
  Preparator,
  Cleanup,
  LFA
}