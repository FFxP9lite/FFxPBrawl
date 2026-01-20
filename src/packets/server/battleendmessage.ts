import { ByteStream } from "../../misc/ByteStream.js";
import { BattleEndData } from "../../misc/BattleEndData.js";
import { config } from "../../Definitions.js";
import { PlayerDisplayData } from "src/misc/PlayerDisplayData.js";
import { Logger } from "src/utility/Logger.js";
import { XpEntry } from "src/misc/XpEntry.js";
import { LogicMilestoneProgress } from "src/misc/LogicMilestoneProgress.js";

// credits: https://github.com/risporce/BSDS/blob/v52/Classes/Packets/Server/Battle/BattleEndMessage.py
// with small snippets from https://github.com/st3a1/PirateBrawl2.0/blob/main/PirateBrawl.Logic/Messages/Battle/BattleEndMessage.js
// and https://github.com/Shei-Bi/ProjectColette-public/blob/main/Supercell.Laser.Logic/Message/Battle/BattleEndMessage.cs
// updated to v59
export class BattleEndMessage {
  static encode(data: BattleEndData): number[] {
    let stream = new ByteStream([]);

    Logger.info(data.result, data.result2, data.rank, data.mapID.low)

    //var game = (data.heroes.length === 10 && data.heroes[0].team === 0) 
    //  ? 5
    //  : (data.heroes.length === 6
    //    ? 1
    //    : (data.heroes.length === 10 ? 2 : 2));
    let game, onScreenCount;
    if (data.heroes.length === 6 || data.heroes.length === 4         // 3v3, 2v2
      || (data.heroes.length === 10 && data.heroes[4].team === 1)) { // 5v5
      game = 1
      onScreenCount = data.heroes.length
    } else if (data.heroes.length === 10 && data.heroes[1].team === 1) {
      game = 2
      onScreenCount = 1
    } else if (data.heroes.length === 10 && data.heroes[2].team === 1) {
      game = 5
      onScreenCount = 2
    } else {
      Logger.warn("Couldn't determine game type, falling back to solo showdown")
      game = 2
      onScreenCount = 1
      // Trios ?
    }

    stream.writeLong(0, data.mapID.low);
    stream.writeLong(0, data.rank);
    stream.writeVInt(game); // Game mode (data.gamemode)
    stream.writeVInt((game === 2 || game === 5) ? (data.rank !== 0 ? data.rank : (data.result2 !== 0 ? data.result2 : data.result)) : data.result); // Result (Victory/Defeat/Draw/Rank Score) (data.rank)
    stream.writeVInt(0); // Tokens Gained (Gained Keys)
    stream.writeVInt(1000); // Trophies Result (Metascore change)
    stream.writeVInt(0); // Power Play Points Gained (Pro League Points)
    stream.writeVInt(0); // Doubled Tokens (Double Keys)
    stream.writeVInt(0); // Double Token Event (Double Event Keys)
    stream.writeVInt(0); // Token Doubler Remaining (Double Keys Remaining)
    stream.writeVInt(0); // Game length in seconds
    // Epic Win Power Play Points Gained (op Win Points)
    stream.writeVInt(0); // Championship Level Reached (CC Wins)
    // One of ^ was removed since v52

    stream.writeBoolean(false); // Gem offer

    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeBoolean(true); // IsPvP
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeVInt(-1); // Challenge type
    stream.writeBoolean(false);

    stream.writeVInt(onScreenCount);
    for (let i = 0; onScreenCount > i; i++) {
      let hero = data.heroes[i]
      Logger.info(hero.id.high, hero.id.low, hero.skinID.high, hero.skinID.low, hero.team, hero.isPlayer, hero.name)
      stream.writeBoolean(hero.isPlayer);
      stream.writeBoolean(hero.team !== data.heroes[0].team);
      stream.writeBoolean(game === 1 ? hero.isPlayer : false); // Star player

      stream.writeByte(1);
      stream.writeDataReference(hero.id.high, hero.id.low);

      stream.writeByte(1);
      stream.writeDataReference(hero.skinID.high, hero.skinID.low)

      stream.writeByte(1);
      stream.writeVInt(hero.isPlayer ? 1000 : 0); // TODO: Real trophies

      stream.writeByte(1);
      stream.writeVInt(hero.isPlayer ? 11 : 1); // TODO: Real power level

      stream.writeByte(0);
  
      stream.writeVInt(1);
  
      stream.writeBoolean(hero.isPlayer);
      if (hero.isPlayer) {
        stream.writeLong(config.id.high, config.id.low);
      }

      // TODO: Thumb and name colour
      stream = new PlayerDisplayData(hero.name, 0, 0).encode(stream);

      stream.writeBoolean(false); // In club (todo)

      stream.writeByte(0);

      stream.writeByte(0);

      stream.writeShort(1); // Kills
      stream.writeShort(2); // Deaths
      stream.writeInt(4);   // Damage
      stream.writeInt(3);   // Healing
      stream.writeDataReference(0, 1);
      stream.writeVInt(0);
      stream.writeVInt(0);
      stream.writeVInt(0);
    }

    stream.writeVInt(0); // xp entry

    stream.writeVInt(0);

    stream.writeVInt(0);

    stream.writeVInt(2); // milestones progress
    stream = new LogicMilestoneProgress(1, 88000, 88000).encode(stream); // Trophies
    stream = new LogicMilestoneProgress(5, 100, 100).encode(stream);     // Unknown

    stream.writeDataReference(0, 1);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeBoolean(false); // ranked match round state
    stream.writeVInt(0);
    stream.writeBoolean(false); // chronos text entry
    stream.writeVInt(0);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeBoolean(false);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeBoolean(false);
    stream.writeBoolean(false); // kudosstatus
    stream.writeBoolean(false);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);

    stream.writeVInt(0);

    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeBoolean(true);
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);

    return stream.payload;
  }
}
