import { publicAssets } from "../data/public-assets.ts";

export interface ImageSize { width: number; height: number }

/** Dimensions are indexed at build time; public image bytes stay on the CDN. */
export function imageSize(publicPath: string): ImageSize | null {
  return Object.hasOwn(publicAssets, publicPath) ? publicAssets[publicPath] : null;
}
