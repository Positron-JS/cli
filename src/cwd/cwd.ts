import { existsSync, mkdirSync, readdirSync, writeFileSync } from "fs";
import { copyFile, mkdir, readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import LocalFile from "../core/LocalFile.js";

function *dirList(src): Generator<string> {
    for (const d of readdirSync(src, { withFileTypes: true })) {
        const c = join(src,d.name);
        if (d.isDirectory()) {
            yield *dirList(c);
            continue;
        }
        yield c;
    }    
}

const copyDir = async (src: string, dest: string, replace) => {
    if (!existsSync(dest)) {
        mkdirSync(dest, { recursive: true });
    }
    for(const item of await readdir(src, { withFileTypes: true })) {
        const srcPath = join(src, item.name);
        const destPath = join(dest, item.name);
        if (item.isDirectory()) {
            await copyDir(srcPath, destPath, replace);
            continue;
        }
        await copyFile(srcPath, destPath);

        if (/\.(cs|xaml|json|xml|csproj)$/i.test(destPath)) {

            // update config...
            const buffer = await readFile(destPath);

            const text = buffer.toString("utf8");

            let replaced = text;
            for (const [k,v] of replace) {
                replaced = replaced.replaceAll(k, v);
            }

            if (replaced !== text) {
                await writeFile(destPath, replaced);
            }
        }

        console.log(`copy ${destPath}`)
    }
};

export const cwd = {

    get path() {
        return process.cwd();
    },

    createTextFileIfNotExists(file, data: string | Buffer) {
        const path = join(this.path, file);
        if (existsSync(path)) {
            return;
        }
        writeFileSync(file, data);
    },

    exists(path) {
        return existsSync(join(this.path, path));
    },

    file(path) {
        return new LocalFile(join(this.path, path))
    },

    async copyFolder(src, dest, config) {
        const path = join(this.path, dest);
        const replace = [];
        for (const key in config) {
            if (Object.prototype.hasOwnProperty.call(config, key)) {
                const element = config[key];
                replace.push([`$$config.${key}$$`, element]);
            }
        }
        await copyDir(src, path, replace);
    },

    async readFile(path) {
        path = join(this.path, path);
        return await readFile(path, "utf8");
    },

    async readJson(path) {
        return JSON.parse(await readFile(path, "utf8"));
    },

    writeFile(path, content, encoding = "utf8" as BufferEncoding) {
        return writeFile(path, content, encoding);
    },

    readDir(path) {
        return dirList(join(this.path, path));
    }

};