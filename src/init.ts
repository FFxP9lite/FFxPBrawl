import { base, config, load, setBase } from "./Definitions.js";
import { installHooks } from "./mainHooks.js";
import { isAndroid } from "./platform.js";
import { Logger } from "./utility/Logger.js";
import { setupCustomSettings } from "./customSettings.js";
import { setupMapMaker } from "./mapmaker.js";

let library = isAndroid ? "libg.so" : "laser";
setBase(Module.getBaseAddress(library));

load();
Logger.info("Running on", isAndroid ? "Android" : "iOS");
Logger.verbose(`${library} loaded at: ${base}`);
for (const brawlerKey in config.ownedBrawlers) {
  const brawler = config.ownedBrawlers[brawlerKey];
  for (const skin of brawler.skins) {
    config.ownedSkins.push(skin);
  }
}
installHooks();
if (config.customSettings) setupCustomSettings();
setupMapMaker()
