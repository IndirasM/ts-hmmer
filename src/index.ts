import { FaModifier } from "./fa-handler";

const modifier = new FaModifier();

(async function run() {
    const args = parseArgs(process.argv);

    const fullFile: string[] = await modifier.read(args.filePath);
    const filteredFile = modifier.filterIncorrectLines(fullFile, args.readLength);

    modifier.writeFilteredFa(filteredFile);
})()

function parseArgs(args: string[]): Arguments {
    return {
        filePath: args[3],
        readLength: +args[2]
    }
}

interface Arguments {
    filePath: string;
    readLength: number;
}