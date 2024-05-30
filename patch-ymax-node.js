const fs = require("fs");

main();

function main() {
    if (process.argv.length < 3) {
        console.log("Usage: patch-ymax [file]");
        return;
    }

    const file = fs.readFileSync(process.argv[2]);
    patchFontBuffer(file);
    fs.writeFileSync("PATCHED_" + process.argv[2], file);
}

function patchFontBuffer(file) {
    const tableCount = file.readUint16BE(4);
    const tables = {};

    let offset = 12;
    for (let i = 0; i < tableCount; i++) {
        const key = file.toString("utf8", offset, offset + 4);
        tables[key] = {
            checksum: file.readInt32BE(offset + 4),
            offset: file.readInt32BE(offset + 8),
            length: file.readInt32BE(offset + 12)
        }
        offset += 16;
    }

    const ascent = file.readInt16BE(tables.hhea.offset + 4);
    file.writeInt16BE(ascent, tables.head.offset + 42);
}
