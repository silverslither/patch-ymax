let input, output;

document.addEventListener("DOMContentLoaded", () => {
    input = document.querySelector("input");
    output = document.querySelector("a");
    input.addEventListener("change", main);
    input.value = "";
});

async function main() {
    const _file = input.files[0];
    if (_file == null)
        return;

    const file = new DataView(await _file.arrayBuffer());
    patchFontBuffer(file);
    const blob = new Blob([file.buffer]);
    output.href = URL.createObjectURL(blob);
    output.download = "PATCHED_" + _file.name;
    output.click();
}

function patchFontBuffer(file) {
    const tableCount = file.getUint16(4);
    const tables = {};

    let offset = 12;
    for (let i = 0; i < tableCount; i++) {
        const key = String.fromCharCode(file.getUint8(offset), file.getUint8(offset + 1), file.getUint8(offset + 2), file.getUint8(offset + 3));
        tables[key] = {
            checksum: file.getInt32(offset + 4),
            offset: file.getInt32(offset + 8),
            length: file.getInt32(offset + 12)
        }
        offset += 16;
    }

    const ascent = file.getInt16(tables.hhea.offset + 4);
    file.setInt16(tables.head.offset + 42, ascent);
}
