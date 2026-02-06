import { Batch, Run } from "@neurospeech/jex/index.js";
import { FileSystem } from "@neurospeech/jex/dist/utils/FileSystem.js";
import { fileURLToPath } from "url";
import { readFile, writeFile } from "fs/promises";

const positronAppDir = fileURLToPath(import.meta.resolve("./app"));

/**
 * 
 * @param {{ filePath: string, replace: (text: string) => string }} p 
 */
const ReplaceText = async ({ filePath, replace }) => {
    let text = await readFile(filePath, "utf-8");
    text = replace(text);
    await writeFile(filePath, text);
}; 

export const Common = {
    PreBuild({ env: {
        MAUI_ICON_IOS_COLOR = "#FFFFFF",
        MAUI_ICON_DROID_COLOR = "#FFFFFF",
        MAUI_SPLASH_SCREEN_COLOR = "#FFFFFF",
        MAUI_SPLASH_BASE_SIZE="128,128"
    } = {} }) {
        return <Batch>
            <FileSystem.RemoveDir
                path="./maui"
                force={true}
                recursive={true}
                />
    
            <FileSystem.Mkdir
                path="./maui"
                />

            <FileSystem.CopyFolder
                src={positronAppDir}
                dest="./maui"
                />
    
            <FileSystem.CopyFile
                src="./res/app-icon-background.svg"
                dest="./maui/PositronApp/Resources/AppIcon/appicon.svg"
                overwrite={true}
                />
    
            <FileSystem.CopyFile
                src="./res/app-icon.droid.svg"
                dest="./maui/PositronApp/Resources/AppIcon/appicon.droid.svg"
                overwrite={true}
                />

            <FileSystem.CopyFile
                src="./res/app-icon.ios.svg"
                dest="./maui/PositronApp/Resources/AppIcon/appicon.ios.svg"
                overwrite={true}
                />

            <FileSystem.CopyFile
                src="./res/splash.svg"
                dest="./maui/PositronApp/Resources/Splash/splash.svg"
                overwrite={true}
                />

            <FileSystem.CopyFile
                src="./config/google-services.json"
                dest="./maui/PositronApp/config/google-services.json"
                overwrite={true}
                />

            <ReplaceText
                filePath="./maui/PositronApp/PositronApp.csproj"
                replace={(text) => {
                    text = text.replaceAll("$(MAUI_ICON_IOS_COLOR)", MAUI_ICON_IOS_COLOR);
                    text = text.replaceAll("$(MAUI_ICON_DROID_COLOR)", MAUI_ICON_DROID_COLOR);
                    text = text.replaceAll("$(MAUI_SPLASH_SCREEN_COLOR)", MAUI_SPLASH_SCREEN_COLOR);
                    text = text.replaceAll("$(MAUI_SPLASH_BASE_SIZE)", MAUI_SPLASH_BASE_SIZE);
                    return text;
                }}
                />

        </Batch>; 
        
    }
};