import { cli } from "./cli.js";
import "./commands/init/init.js";
import "./commands/sync/sync.js";
cli.execute(process.argv);