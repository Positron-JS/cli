import { cwd } from "../../cwd/cwd.js";
import { cli } from "../../cli.js";
import { AppInfo, packagePath } from "../../AppInfo.js";
import { spawnSync } from "child_process";
import { join, resolve } from "path";


cli
    .command("init")
    .execute( async (command, options) => {
    
        // update package.json

        const pkg = await cwd.readJson("package.json");
        pkg.dependencies ??= {};
        pkg.devDependencies ??= {};
        pkg.devDependencies["@positron-js/cli"] = "^" + AppInfo.version;
        pkg.dependencies["@neurospeech/jex"] = AppInfo.dependencies["@neurospeech/jex"];
        pkg.scripts ??= {};
        pkg.scripts.postversion = "git push --follow-tags";

        await cwd.writeFile("package.json", JSON.stringify(pkg, void 0, 4));

        // run npm install....
        spawnSync("npm", ["install"]);

        const templateFolder = join(packagePath, "template");


        await cwd.copyFolder(templateFolder, resolve("."), {});

    });