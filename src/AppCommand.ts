import { Command } from "commander";
import { AppInfo } from "./AppInfo.js";

export const AppCommands = new Command();

AppCommands
    .name("@dot-web-shell/cli")
    .description("CLI to create default dot web shell app.")
    .version(AppInfo.version);
