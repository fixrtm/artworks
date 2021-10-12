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
const logoFullSvg = svgToString(svgElement);
makeRounded(svgElement);
const logoRoundedFullSvg = svgToString(svgElement);

await writeDst("logo-full.svg", logoFullSvg + '\n');
await writeDst("logo-circle-full.svg", logoRoundedFullSvg + '\n');
await writeDst("logo-min.svg", optimize('logo-fill.svg', logoFullSvg));
await writeDst("logo-circle-min.svg", optimize('logo-circle-fill.svg', logoRoundedFullSvg));

/**
 * @param svg {SVGSVGElement}
 */
function makeRounded(svg) {
    const document = svg.ownerDocument;
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const children = Array.from(svg.childNodes)
    for (let child of children) {
        svg.removeChild(child);
        g.appendChild(child);
    }
    g.setAttribute("transform", "scale(0.9) translate(40, 40)");
    svg.appendChild(g);
    //<circle cx="200" cy="200" r="205" fill="none" stroke="black"/>
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute('cx', '200');
    circle.setAttribute('cy', '200');
    circle.setAttribute('r', '205');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', 'black');
    svg.appendChild(circle);
}

function optimize(path, body) {
    return svgo.optimize(body, {path}).data
}
