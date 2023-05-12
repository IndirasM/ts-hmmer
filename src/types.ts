export interface Arguments {
  filePath: string[];
  readLength: number;
  mode: Mode
}

export enum Mode {
  Generator,
  Preparator,
  Merge,
  LFA,
  Split,
  NameSequences,
  UniqueFilter,
  NhmmerFilter
}