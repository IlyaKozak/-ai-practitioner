import { Artwork } from './types/docType';

export function removeNulls(obj: Artwork) {
  return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== null));
}
