import openType from 'opentype.js'
import {loadSrc} from "./utils.mjs";

const {Font, parse} = openType;

let fontPaths = [
    "third_party/liberation-fonts/LiberationMono-Bold.ttf",
    "third_party/liberation-fonts/LiberationMono-BoldItalic.ttf",
    "third_party/liberation-fonts/LiberationMono-Italic.ttf",
    "third_party/liberation-fonts/LiberationMono-Regular.ttf",
    "third_party/liberation-fonts/LiberationSans-Bold.ttf",
    "third_party/liberation-fonts/LiberationSans-BoldItalic.ttf",
    "third_party/liberation-fonts/LiberationSans-Italic.ttf",
    "third_party/liberation-fonts/LiberationSans-Regular.ttf",
    "third_party/liberation-fonts/LiberationSerif-Bold.ttf",
    "third_party/liberation-fonts/LiberationSerif-BoldItalic.ttf",
    "third_party/liberation-fonts/LiberationSerif-Italic.ttf",
    "third_party/liberation-fonts/LiberationSerif-Regular.ttf",
];

let fonts = await Promise.all(fontPaths.map(async (path) => parse((await loadSrc(path)).buffer)));

/** @type {{[Name in string]?: {[Weight in number]?: {[Italic in number]?: Font}}}} */
let fontsTable = {};

for (let font of fonts) {
    const name = font.getEnglishName("postScriptName");
    const weight = font.tables.os2.usWeightClass;
    const italic = font.tables.os2.fsSelectionValues;

    const namedTable = fontsTable[name] ?? (fontsTable[name] = Object.create(null));
    const weightTable = namedTable[weight] ?? (namedTable[weight] = Object.create(null));
    weightTable[italic] = font;
}

/**
 * @param {Object} style
 * @param {String} style.family
 * @param {Number} style.wght
 * @param {Number} style.ital
 */
export default function fontsHandler(style) {
    const familyTable = fontsTable[style.family];
    if (familyTable == null) return null;
    const weightTable = familyTable[style.wght] || Object.values(familyTable)[0];
    if (weightTable == null) return null;
    return weightTable[style.ital] || Object.values(weightTable)[0];
}
