import { join } from "path";
import { AppInfo, packagePath } from "../../AppInfo.js";
import { cli } from "../../cli.js";
import { cwd } from "../../cwd/cwd.js";
import { copyFile, readFile, writeFile } from "fs/promises";
import { spawn, spawnSync } from "child_process";
import * as cheerio from "cheerio";

cli
    .command("sync")
    .description("Generate the Mobile App Source Code for the App, Warning, this will override existing files")
    .execute(async (command, options) => {
        const contentAppFolder = join(packagePath, "content", "app");

        if (!cwd.exists("maui")) {

            await cwd.copyFolder(contentAppFolder, "maui", {});

        }

        const setupFile = join(packagePath, "setup-build.mjs");

        const destSetupFile = cwd.file("setup-build.mjs");
        await copyFile(setupFile, destSetupFile.path);

        const pkgFile = cwd.file("package.json");

        const pkg = await pkgFile.readJson();

        pkg.devDependencies ??= {};
        pkg.devDependencies["@dot-web-shell/cli"] = "^" + AppInfo.version;
        pkg.scripts ??= {};
        pkg.scripts.sync = "node ./node_modules/@dot-web-shell/cli sync";
        pkg.scripts.postversion = "npm run sync && git push --follow-tags";
        pkg.scripts.build = "node ./setup-build.mjs";

        await pkgFile.writeJson(pkg);


        const dotConfig = cwd.file("dot-web-shell.config.json");

        const config = await dotConfig.readJson();
        const tokens = pkg.version.split(".");
        tokens.pop();
        config.version = tokens.join(".");
        config.buildNumber ??= 1;
        config.buildNumber = (parseInt(config.buildNumber, 10) + 1).toString();

        await dotConfig.writeJson(config);

        // update relevant files...
        await updateProjectFile(config);

        await updateConfigUrl(config);

        spawnSync("git",["add","-A"]);
        spawnSync("git",["commit","-m", `Build Updated to ${config.buildNumber}`]);
    

    });


async function updateProjectFile(config: any) {
    const projectFile = cwd.file("maui/PositronApp/PositronApp.csproj");
    const $ = cheerio.load(await projectFile.readFile("utf8"), {
        xmlMode: true,
        xml: {
            xmlMode: true,
            decodeEntities: false
        }
    });
    $("Project > PropertyGroup > ApplicationDisplayVersion").text(config.version);
    $("Project > PropertyGroup > ApplicationVersion").text(config.buildNumber);
    await projectFile.writeFile( $.xml(), "utf8");
}

async function updateConfigUrl(config: any) {
    const appSettingsFile = cwd.file("maui/PositronApp/appsettings.json");
    const appSettings = await appSettingsFile.readJson();
    appSettings.App.Url = config.url;
    await appSettingsFile.writeJson(appSettings);
}

