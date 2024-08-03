//Necessary imports
import path from "path";
//Declare a constant for setting the path to upload the photo in the server
const uploadsPath = path.resolve(__dirname, "..", "uploads");

//Function to get the relative filepath to put in the server
function getRelativeFilePath(filename: string): string {
  return path.relative(process.cwd(), path.join(uploadsPath, filename));
}

export default getRelativeFilePath;
