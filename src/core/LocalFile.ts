import { existsSync, readdirSync } from "fs";
import { copyFile, readFile, writeFile } from "fs/promises";
import { join, parse } from "path";

export default class LocalFile {

    static *readDir(src: string): Generator<LocalFile> {
        for (const d of readdirSync(src, { withFileTypes: true })) {
            const c = join(src,d.name);
            if (d.isDirectory()) {
                yield *LocalFile.readDir(c);
                continue;
            }
            yield new LocalFile(c);
        }    
    
    }

    readonly dir: string;
    readonly ext: string;
    readonly name: string;
    readonly onlyName: string;

    constructor(public readonly path) {
        const { dir, ext , base, name} = parse(this.path);

        this.dir = dir;
        this.ext = ext;
        this.name = base;
        this.onlyName = name;
    }

    exists() {
        return existsSync(this.path);
    }

    writeFile(content: Buffer | string, encoding?: BufferEncoding) {
        return writeFile(this.path, content, encoding);
    }

    readFile(): Promise<Buffer>;
    readFile(encoding: BufferEncoding): Promise<string>;
    readFile(encoding?: any): any {
        return readFile(this.path, encoding);
    }

    async readJson() {
        return JSON.parse(await this.readFile("utf8"));
    }

    async writeJson(json) {
        return this.writeFile(JSON.stringify(json, void 0, 4));
    }

    async copyTo(dest: string) {
        await copyFile(this.path, dest);
    }

}