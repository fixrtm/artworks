import {readFile, mkdir, writeFile} from 'fs/promises';
import {dirname} from 'path';

/**
 * @param {string} path
 * @return {Promise<Buffer>}
 */
export async function loadSrc(path) {
    return await readFile(new URL(`../src/${path}`, import.meta.url))
}

/**
 * @param {string} path
 * @param {'ascii'|'utf8'|'utf16le'|'ucs2'|'base64'|'base64url'|'latin1'|'binary'|'hex'} encoding
 * @return {Promise<string>}
 */
export async function loadSrcStr(path, encoding) {
    return await readFile(new URL(`../src/${path}`, import.meta.url), { encoding })
}

/**
 * @param {string} path
 * @param {string | Buffer} body
 */
export async function writeDst(path, body) {
    const url = new URL(`../dist/${path}`, import.meta.url);
    if (url.protocol !== 'file:') throw new Error(`invalid scheme: ${url.protocol}. must be file`);
    const absolute = url.pathname;
    await mkdir(dirname(absolute), {recursive: true}).catch((_) => null);
    await writeFile(absolute, body);
}
