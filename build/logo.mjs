import {replaceAllInString} from "svg-text-to-path";
import fontsHandler from "./fonts.mjs";
import {loadSrcStr, writeDst} from "./utils.mjs";
import svgo from 'svgo';

const svgBody = await loadSrcStr("logo.svg", "utf8");
await writeDst("logo-readable.svg", svgBody);

const transformed = await replaceAllInString(svgBody, {
    handlers: [fontsHandler],
    merged: true,
});
await writeDst("logo-full.svg", transformed);

const minified = svgo.optimize(transformed, {
    path: 'logo-full.svg',
})
await writeDst("logo-min.svg", minified.data);
