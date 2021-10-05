import {getSvgElement, replaceAll, svgToString} from "svg-text-to-path";
import fontsHandler from "./fonts.mjs";
import {loadSrcStr, writeDst} from "./utils.mjs";
import svgo from 'svgo';

const svgBody = await loadSrcStr("logo.svg", "utf8");
await writeDst("logo-readable.svg", svgBody);

const svgElement = getSvgElement(svgBody);
await replaceAll(svgElement, {
    handlers: [fontsHandler],
    merged: true,
});
for (let pathElement of svgElement.querySelectorAll('path')) {
    pathElement.removeAttribute('font-size')
    pathElement.removeAttribute('font-family')
}
await writeDst("logo-full.svg", svgToString(svgElement) + '\n');

const minified = svgo.optimize(svgToString(svgElement), {
    path: 'logo-full.svg',
})
await writeDst("logo-min.svg", minified.data);
