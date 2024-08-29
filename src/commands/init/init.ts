import { cwd } from "../../cwd/cwd.js";
import { cli } from "../../cli.js";
import { AppInfo, packageContentFile, packagePath } from "../../AppInfo.js";
import { spawnSync } from "child_process";
import { join } from "path";


cli
    .command("init")
    .execute( async (command, options) => {
    
        // update package.json

        const pkg = await cwd.readJson("package.json");
        pkg.dependencies ??= {};
        pkg.devDependencies ??= {};
        pkg.devDependencies["@dot-web-shell/cli"] = "^" + AppInfo.version;
        pkg.dependencies["@neurospeech/jex"] = AppInfo.dependencies["@neurospeech/jex"];
        pkg.scripts ??= {};
        pkg.scripts.postversion = "git push --follow-tags";

        await cwd.writeFile("package.json", JSON.stringify(pkg, void 0, 4));

        // run npm install....
        spawnSync("npm", ["install"]);

        const contentAppFolder = join(packagePath, "content", "app");

        if (!cwd.exists("maui")) {

            await cwd.copyFolder(contentAppFolder, "maui", {});

        }

        await cwd.createTextFileIfNotExists("build-android.config.js", await packageContentFile("build-android.config.js").readFile())
        await cwd.createTextFileIfNotExists("build-ios.config.js", await packageContentFile("build-ios.config.js").readFile())

        await packageContentFile("build-android.jsx").copyTo("build-android.jsx");
        await packageContentFile("build-ios.jsx").copyTo("build-ios.jsx");
    });