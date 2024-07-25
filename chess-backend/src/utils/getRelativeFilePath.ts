import path from "path";

const uploadsPath = path.resolve(__dirname, "..", "uploads");

function getRelativeFilePath(filename: string): string {
  return path.relative(process.cwd(), path.join(uploadsPath, filename));
}

export default getRelativeFilePath;
