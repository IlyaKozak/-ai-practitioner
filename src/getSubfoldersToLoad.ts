import fs from 'fs/promises';
import path from 'path';

export async function getSubFoldersToLoad(directoryPath: string) {
  try {
    return (await fs.readdir(directoryPath, { withFileTypes: true }))
      .filter((dir) => dir.isDirectory())
      .map((dir) => path.join(directoryPath, dir.name));
  } catch (err) {
    console.log(err);
  }
}
