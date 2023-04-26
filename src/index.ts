import { FaModifier } from "./fa-handler";

const modifier = new FaModifier();
const readLength: number = 219;

(async function run() {
    const fullFile: string[] = await modifier.read();
    const filteredFile = modifier.filterIncorrectLines(fullFile, readLength);

    modifier.writeFilteredFa(filteredFile);
})()