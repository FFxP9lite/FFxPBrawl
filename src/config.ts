import { Brawler } from "./brawler.js";
import { configPath, libc } from "./definitions.js";
import { Event } from "./event.js";
import { Long } from "./long.js";

export class Config {
  id: Long = new Long(0, 1);
  tutorial = true;
  registered = false;
  name = "Natesworks";
  coins = 0;
  gems = 0;
  bling = 0;
  starpoints = 0;
  experienceLevel = 0;
  experience = 0;
  namecolor = 0;
  thumbnail = 0;
  trophyRoadTier = 0;
  tokens = 0;
  tokenDoublers = 0;
  trioWins = 0;
  soloWins = 0;
  duoWins = 0;
  challengeWins = 0;
  selectedBrawlers = [0, 1, 2];
  enableShop = false;
  enableBrawlPass = false;
  lobbyinfo = "";
  enableClubs = false;
  brawlPassPremium = true;
  ownedBrawlers: Record<number, Brawler> = {};
  disableBots = false;
  infiniteAmmo = false;
  infiniteSuper = false;
  china = false;
  artTest = false;
  customLoadingScreen = true;
  writeLogsToFile = false;
  debugMenu = true;
  events: Event[] = [];
  rankedCurrent: number = 0;
  rankedHighest: number = 0;
  prestige: number = 0;
  fameCredits: number = 0;
  favouriteBrawler: number = 0;
  rankedReputation: number = 0;
  region: string = "";
  supportedCreator: string = "";
  allCreatorCodesValid = false;
  creatorCodes: string[] = [];
  randomBotNames = true;
  draftMapLimit: number = 100;
  winstreak = 0;
  winstreakBrawler = 0;
  creationDate = 0;
  highestRoboRumbleLvlPassed = 0;
  highestBossFightLvlPassed = 0;
  highestRampageLvlPassed = 0;
  mostChallengeWins = 0;
  highestClubLeague = 0;
  highestSoloLeague = 0;
  r35brawlers = 0;
  teamExperiment = false;
  logLevel = 0;
  enableSupercellID = false;
  hiddenSettingsButtons: string[] = [
    "button_faq",
    "button_terms",
    "button_privacy",
    "button_parentsguide",
    "button_thirdparty",
    "button_api",
    "button_random_reward_rates",
    "button_kakao_connect",
    "button_privact_settings",
    "button_birthday",
    "button_ads",
    "button_privacy_settings",
    "button_sc_id",
  ];
  customSettings = true;
  passTokens = 40000;
  plus = true;
  ownedPins: number[] = [];
  ownedSkins: number[] = [];
  ownedThumbnails: number[] = [0];
}

export function readConfig() {
  const json = JSON.parse(File.readAllText(configPath));
  const config = new Config();

  if (json.id) {
    config.id = new Long(json.id[0], json.id[1]);
  }
  config.tutorial = json.tutorial;
  config.registered = json.registered;
  config.coins = json.coins;
  config.gems = json.gems;
  config.bling = json.bling;
  config.starpoints = json.starpoints;
  config.experienceLevel = json.level;
  config.experience = json.experience;
  config.namecolor = json.namecolor;
  config.thumbnail = json.thumbnail;
  config.trophyRoadTier = json["trophyRoadTier"];
  config.selectedBrawlers = json.selectedBrawlers;
  config.tokens = json.tokens;
  config.tokenDoublers = json.tokenDoublers;
  config.trioWins = json["3v3Victories"];
  config.soloWins = json.soloVictories;
  config.duoWins = json.duoVictories;
  config.challengeWins = json.mostChallengeWins;
  config.lobbyinfo = json.lobbyinfo;
  config.enableBrawlPass =
    json.enableBrawlPass == null ? false : json.enableBrawlPass;
  config.enableShop = json.enableShop == null ? false : json.enableShop;
  config.enableClubs = json.enableClubs == null ? false : json.enableClubs;
  config.disableBots = json.disableBots == null ? false : json.disableBots;
  config.infiniteAmmo = json.infiniteAmmo == null ? false : json.infiniteAmmo;
  config.infiniteSuper =
    json.infiniteSuper == null ? false : json.infiniteSuper;
  config.china = json.china == null ? false : json.china;
  config.name = json.name == null ? "Natesworks" : json.name;
  config.artTest = json.artTest == null ? false : json.artTest;
  config.customLoadingScreen =
    json.customLoadingScreen == null ? true : json.customLoadingScreen;
  config.writeLogsToFile = 
    json.writeLogsToFile === null ? false : json.writeLogsToFile;
  config.debugMenu = json.debugMenu == null ? true : json.debugMenu;
  for (const [id, brawler] of Object.entries(
    json.unlockedBrawlers as Record<string, any>,
  )) {
    config.ownedBrawlers[Number(id)] = new Brawler(
      brawler.cardID,
      brawler.skins,
      brawler.trophies,
      brawler.highestTrophies,
      brawler.powerlevel,
      brawler.powerpoints,
      brawler.state,
      brawler.masteryPoints,
      brawler.masteryClaimed,
      brawler.winstreak || 0,
    );
  }
  config.events = json.events;
  config.rankedCurrent = json.rankedCurrent;
  config.rankedHighest = json.rankedHighest;
  config.prestige = json.prestige;
  config.fameCredits = json.fameCredits;
  config.favouriteBrawler = json.favouriteBrawler;
  config.rankedReputation = json.rankedReputation || 100;
  config.region = json.region || "PL";
  config.supportedCreator = json.supportedCreator || "Natesworks";
  config.allCreatorCodesValid = json.allCreatorCodesValid || false;
  config.creatorCodes = json.creatorCodes || [
    "Natesworks",
    "kubune",
    "Hallo",
    "Kazarex",
    "Ryo",
    "Banaanae",
  ];
  config.randomBotNames = json.randomBotNames || true;
  config.draftMapLimit = json.draftMapLimit || 5;
  config.winstreak = json.winstreak || 0;
  config.winstreakBrawler = json.winstreakBrawler || 0;
  config.creationDate = json.creationDate || 0;
  if (json.previousStats) {
    config.highestRoboRumbleLvlPassed =
      json.previousStats.highestRoboRumbleLvlPassed || 0;
    config.highestBossFightLvlPassed =
      json.previousStats.highestBossFightLvlPassed || 0;
    config.highestRampageLvlPassed =
      json.previousStats.highestRampageLvlPassed || 0;
    config.challengeWins = json.previousStats.challengeWins || 0;
    config.highestClubLeague = json.previousStats.highestClubLeague || 0;
    config.highestSoloLeague = json.previousStats.highestSoloLeague || 0;
    config.r35brawlers = json.previousStats.r35brawlers || 0;
  }
  config.teamExperiment = json.teamExperiment || false;
  config.logLevel = json.logLevel || 0;
  config.enableSupercellID = json.enableSupercellID || false;
  config.customSettings = json.customSettings || true;
  if (json.brawlpass) {
    config.enableBrawlPass = json.brawlpass.enabled;
    config.brawlPassPremium = json.brawlpass.hasPremium;
    config.plus = json.brawlpass.hasPlus;
    config.passTokens = json.brawlpass.tokens;
  }

  return config;
}

export function writeConfig(config: Config) {
  const data: any = {};

  data.tutorial = config.tutorial;
  data.registered = config.registered;
  data.name = config.name;
  data.coins = config.coins;
  data.gems = config.gems;
  data.bling = config.bling;
  data.starpoints = config.starpoints;
  data.level = config.experienceLevel;
  data.experience = config.experience;
  data.namecolor = config.namecolor;
  data.thumbnail = config.thumbnail;
  data.trophyRoadTier = config.trophyRoadTier;
  data.selectedBrawlers = config.selectedBrawlers;
  data.tokens = config.tokens;
  data.tokenDoublers = config.tokenDoublers;
  data["3v3Victories"] = config.trioWins;
  data.soloVictories = config.soloWins;
  data.duoVictories = config.duoWins;
  data.mostChallengeWins = config.challengeWins;
  data.lobbyinfo = config.lobbyinfo;
  data.enableShop = config.enableShop;
  data.enableClubs = config.enableClubs;
  data.disableBots = config.disableBots;
  data.infiniteAmmo = config.infiniteAmmo;
  data.infiniteSuper = config.infiniteSuper;
  data.china = config.china;
  data.artTest = config.artTest;
  data.customLoadingScreen = config.customLoadingScreen;
  data.writeLogsToFile = config.writeLogsToFile;
  data.debugMenu = config.debugMenu;
  data.region = config.region;
  data.supportedCreator = config.supportedCreator;
  data.allCreatorCodesValid = config.allCreatorCodesValid;
  data.creatorCodes = config.creatorCodes;

  data.unlockedBrawlers = {};
  for (const [id, brawler] of Object.entries(config.ownedBrawlers)) {
    data.unlockedBrawlers[Number(id)] = {
      cardID: brawler.cardID,
      skins: brawler.skins,
      trophies: brawler.trophies,
      highestTrophies: brawler.highestTrophies,
      powerlevel: brawler.powerlevel,
      powerpoints: brawler.powerpoints,
      state: brawler.state,
      masteryPoints: brawler.masteryPoints,
      masteryClaimed: brawler.masteryClaimed,
      winstreak: brawler.winstreak,
    };

    data.events = config.events;
    data.rankedCurrent = config.rankedCurrent;
    data.rankedHighest = config.rankedHighest;
    data.prestige = config.prestige;
    data.fameCredits = config.fameCredits;
    data.favouriteBrawler = config.favouriteBrawler;
    data.rankedReputation = config.rankedReputation;
    data.randomBotNames = config.randomBotNames;
    data.draftMapLimit = config.draftMapLimit;
    data.winstreak = config.winstreak;
    data.winstreakBrawler = config.winstreakBrawler;
    data.creationDate = config.creationDate;
    data.previousStats = {
      highestRoboRumbleLvlPassed: config.highestRoboRumbleLvlPassed,
      highestBossFightLvlPassed: config.highestBossFightLvlPassed,
      highestRampageLvlPassed: config.highestRampageLvlPassed,
      challengeWins: config.challengeWins,
      highestClubLeague: config.highestClubLeague,
      highestSoloLeague: config.highestSoloLeague,
      r35brawlers: config.r35brawlers,
    };

    data.teamExperiment = config.teamExperiment;
    data.logLevel = config.logLevel;
    data.enableSupercellID = config.enableSupercellID;
    data.customSettings = config.customSettings;

    data.brawlpass = {
      enabled: config.enableBrawlPass,
      hasPremium: config.brawlPassPremium,
      hasPlus: config.plus,
      tokens: config.passTokens,
    };
  }

  const remove = new NativeFunction(libc.getExportByName("remove"), "int", [
    "pointer",
  ]);
  remove(Memory.allocUtf8String(configPath));
  File.writeAllText(configPath, JSON.stringify(data, null, 2));
}
