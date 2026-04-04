import { CAST_SOURCE_ROWS, type CastTabId } from "./castSourceData";

export type { CastTabId };

export interface CastDisplayItem {
  id: number;
  category: CastTabId;
  name: string;
  description: string;
  image: string;
}

export const buildCastDisplayItems = (defaultImageSrc: string): CastDisplayItem[] =>
  CAST_SOURCE_ROWS.map(
    (row): CastDisplayItem => ({
      id: row.id,
      category: row.category,
      name: row.name,
      description: row.description,
      image: defaultImageSrc,
    }),
  );
