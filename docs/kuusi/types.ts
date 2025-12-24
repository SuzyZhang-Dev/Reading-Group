
export interface ReadingRecord {
  treeId: string;
  member: string;
  wordCount: number;
  bookTitle: string;
  review?: string;
}

export interface TreeGroup {
  id: string;
  records: ReadingRecord[];
}

export interface ColorPalette {
  poinsettaRed: string;
  rusticWood: string;
  darkTruffle: string;
  mistletoeShadow: string;
  darkChocolate: string;
  bow: string;
  warmWood: string;
  candle: string;
  leaf: string;
  juniper: string;
  cookies: string;
  berryKiss: string;
  candleGlow: string;
  winterGarden: string;
}
