import { Batch, Run } from "@neurospeech/jex/index.js";
import { FileSystem } from "@neurospeech/jex/dist/utils/FileSystem.js";
import { Batch } from "@neurospeech/jex";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";
import { writeFile } from "fs";

const positronAppDir = fileURLToPath(import.meta.resolve("./app"));

const ReplaceText = async ({ filePath, test, replace }) => {
    let text = await readFile(filePath, "utf-8");
    text = text.replaceAll(test, replace);
    await writeFile(filePath, text);
}; 

export const Common = {
    PreBuild({ }) {
        return <Batch>
            <FileSystem.RemoveDir
                path="./maui"
                force={true}
                recursive={true}
                />
    
            <FileSystem.Mkdir
                path="./maui"
                />

            <Run cmd="cd" args={["./maui"]} />

            <FileSystem.CopyFolder
                src={positronAppDir}
                dest="./maui"
                />
    
            <FileSystem.CopyFile
                src="./res/app-icon-background.svg"
                dest="./maui/PositronApp/Resources/AppIcon/appicon.svg"
                />
    
            <FileSystem.CopyFile
                src="./res/app-icon.droid.svg"
                dest="./maui/PositronApp/Resources/AppIcon/appicon.droid.svg"
                />

            <FileSystem.CopyFile
                src="./res/app-icon.ios.svg"
                dest="./maui/PositronApp/Resources/AppIcon/appicon.ios.svg"
                />

            <FileSystem.CopyFile
                src="./res/spalsh.svg"
                dest="./maui/PositronApp/Resources/Splash/splash.svg"
                />

            <FileSystem.CopyFile
                src="./config/google-services.json"
                dest="./maui/PositronApp/conifg/google-services.json"
                />

            <ReplaceText
                filePath="./maui/PositronApp/Positron.csproj"
                test=
                />

        </Batch>; 
        
    }
};