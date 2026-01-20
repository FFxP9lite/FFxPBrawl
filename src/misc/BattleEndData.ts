import { Hero } from "./Hero.js";
import { Long } from "../Long.js";

export class BattleEndData {
    result: number;
    result2: number;
    rank: number;
    mapID: Long;
    heroes: Hero[];

    constructor(result: number, result2: number, rank: number, mapID: Long, heroes: Hero[]) {
        this.result = result;
        this.result2 = result2;
        this.rank = rank;
        this.mapID = mapID;
        this.heroes = heroes;
    }
}