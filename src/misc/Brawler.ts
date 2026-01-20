export class Brawler {
  cardID: number;
  skins: number[];
  trophies: number;
  highestTrophies: number;
  powerlevel: number;
  powerpoints: number;
  state: number;
  masteryPoints: number;
  masteryClaimed: number;
  winstreak: number;
  constructor(
    cardID: number,
    skins: number[],
    trophies: number,
    highestTrophies: number,
    powerlevel: number,
    powerpoints: number,
    state: number,
    masteryPoints: number,
    masteryClaimed: number,
    winstreak: number,
  ) {
    this.cardID = cardID;
    this.skins = skins;
    this.trophies = trophies;
    this.highestTrophies = highestTrophies;
    this.powerlevel = powerlevel;
    this.powerpoints = powerpoints;
    this.state = state;
    this.masteryPoints = masteryPoints;
    this.masteryClaimed = masteryClaimed;
    this.winstreak = winstreak;
  }
}

