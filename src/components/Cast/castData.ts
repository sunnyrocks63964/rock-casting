import { CAST_SOURCE_ROWS, type CastTabId } from "./castSourceData";

export type { CastTabId };

export interface CastDisplayItem {
  id: number;
  category: CastTabId;
  name: string;
  description: string;
  image: string;
}

/** モデル用（public/casts/models/{name}.png） */
const modelCastPublicImageSrc = (castName: string): string =>
  `/casts/models/${encodeURIComponent(castName)}.png`;

/** フォトグラファー用（public/casts/photographers/{name}.png） */
const photographerCastPublicImageSrc = (castName: string): string =>
  `/casts/photographers/${encodeURIComponent(castName)}.png`;

/** アーティスト用（public/casts/artists/{name}.png） */
const artistCastPublicImageSrc = (castName: string): string =>
  `/casts/artists/${encodeURIComponent(castName)}.png`;

/** クリエイター用（public/casts/creators/{name}.png） */
const creatorCastPublicImageSrc = (castName: string): string =>
  `/casts/creators/${encodeURIComponent(castName)}.png`;

const resolveCastImageSrc = (
  category: CastTabId,
  name: string,
  defaultImageSrc: string,
): string => {
  if (category === "model") {
    return modelCastPublicImageSrc(name);
  }
  if (category === "photographer") {
    return photographerCastPublicImageSrc(name);
  }
  if (category === "artist") {
    return artistCastPublicImageSrc(name);
  }
  if (category === "creator") {
    return creatorCastPublicImageSrc(name);
  }
  return defaultImageSrc;
};

export const buildCastDisplayItems = (defaultImageSrc: string): CastDisplayItem[] =>
  CAST_SOURCE_ROWS.map(
    (row): CastDisplayItem => ({
      id: row.id,
      category: row.category,
      name: row.name,
      description: row.description,
      image: resolveCastImageSrc(row.category, row.name, defaultImageSrc),
    }),
  );
