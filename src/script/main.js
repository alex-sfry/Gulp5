import '../styles/css/style.css';
import { data, keymap } from './data.js';
import { XMLParser } from 'fast-xml-parser';
import { HtmlTable } from './HtmlTable.js';

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    allowBooleanAttributes: true
});

document.getElementById("filesToUpload").addEventListener("change", async (e) => {
    const fileName = e.target.files.length > 0 ? e.target.files[0].name : "No file chosen";
    document.querySelector(".file-name").textContent = fileName;
});

document.getElementById('fileSubmitBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("filesToUpload");
    const xml = await getXml(fileInput.files[0]);
    new HtmlTable('table', 9, prepTableData(parseXML(xml)), ['action', 'group', 'key']);
    document.getElementById('fileForm').classList.add('hidden');
});

async function getXml(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsText(file); // Read as text (adjust for other data types)
    });
}

function parseXML(xml) {
    const obj = parser.parse(xml);
    const bindings = [];

    for (const key in obj.Root) {
        if (!Object.hasOwn(obj.Root, key)) continue;
        if (!Object.hasOwn(obj.Root[key], 'Primary')) continue;
        if (!Object.hasOwn(obj.Root[key]['Primary'], 'Device')) continue;
        if (!data[key]) continue;

        if (obj.Root[key].Primary.Device === 'Keyboard') {
            const rawKey = obj.Root[key].Primary.Key.replace('Key_', '');
            const kbdKey = Object.hasOwn(keymap, rawKey) ? keymap[rawKey] : rawKey;

            bindings.push({
                action: key,
                key: kbdKey
            });
        }
    }

    return bindings;
}

function prepTableData(bindings) {
    const rowItemsQty = 9;
    const groups = [
        "Ship",
        "Fighter",
        "UI",
        "SRV",
        "Scanners",
        "Galaxy map",
        "Misc",
        "Camera",
        "Holo-Me",
        "Head look",
        "Camera",
        "Multicrew",
        "OnFoot"
    ];

    const tableData = new Map();
    groups.forEach(item => tableData.set(item, []));

    bindings.forEach(item => {
        tableData.get(data[item.action].Group).push(
            data[item.action].Name,
            data[item.action].Group,
            item.key
        );
    });

    const iterable = tableData.entries();
    const tableRows = [];
    let rowArr = [];

    for (const group of iterable) {
        if (group[1].length === 0) continue;
        tableRows.push(group[0]);

        group[1].forEach((item, index) => {
            rowArr.push(item);

            if (rowArr.length === rowItemsQty) {
                tableRows.push(rowArr);
                rowArr = [];
            } else if (index + 1 === group[1].length) {
                rowArr = [
                    ...rowArr,
                    ...Array((rowItemsQty - 1) - (rowArr.length - 1)).fill('')
                ];
                tableRows.push(rowArr);
                rowArr = [];
            }
        });
    }

    return tableRows;
}
