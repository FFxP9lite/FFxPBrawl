import { ByteStream } from "../../bytestream.js";
import { BattleEndData } from "../../battleenddata.js";
import { config } from "../../definitions.js";
import { PlayerDisplayData } from "src/playerdisplaydata.js";
import { Logger } from "src/utility/logger.js";
import { XpEntry } from "src/xpentry.js";

// credits: https://github.com/risporce/BSDS/blob/v52/Classes/Packets/Server/Battle/BattleEndMessage.py
// with small snippets from https://github.com/st3a1/PirateBrawl2.0/blob/main/PirateBrawl.Logic/Messages/Battle/BattleEndMessage.js
// and https://github.com/Shei-Bi/ProjectColette-public/blob/main/Supercell.Laser.Logic/Message/Battle/BattleEndMessage.cs
// updated to v59
export class BattleEndMessage {
  static encode(data: BattleEndData): number[] {
    let stream = new ByteStream([]);

    Logger.info(data.result, data.type, data.rank, data.mapID.low)

    //var game = (data.heroes.length === 10 && data.heroes[0].team === 0) 
    //  ? 5
    //  : (data.heroes.length === 6
    //    ? 1
    //    : (data.heroes.length === 10 ? 2 : 2));
    let game;
    if (data.heroes.length === 6) {
      game = 1 + 1 // TODO: 3v3 is crashing so pretend SD for now
    } else if (data.heroes.length === 10) {
      game = 2
      // TODO: Duo
    } else {
      game = 2
      // Duo 5
      // 2v2 ?
      // 5v5 ?
      // Trios ?
      // Duels ?
    }

    const onScreenCount = game === 2 ? 1 : data.heroes.length

    stream.writeLong(0, data.mapID.low);
    stream.writeLong(0, data.rank);
    stream.writeVInt(game); // Game mode (data.gamemode)
    stream.writeVInt((game === 2 || game === 5) ? (data.rank !== 0 ? data.rank : data.result2) : data.result); // Result (Victory/Defeat/Draw/Rank Score) (data.rank)
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
      Logger.info(hero.id, hero.skinID, hero.team, hero.isPlayer, hero.name)
      stream.writeBoolean(hero.isPlayer);
      stream.writeBoolean(Boolean(hero.team));
      stream.writeBoolean(false);

      stream.writeVInt(1);
      stream.writeDataReference(hero.id.high, hero.id.low);

      stream.writeVInt(1);
      stream.writeDataReference(hero.skinID.high, hero.skinID.low)

      stream.writeVInt(1);
      stream.writeVInt(hero.isPlayer ? 1000 : 0); // TODO: Real trophies

      stream.writeVInt(1);
      stream.writeVInt(hero.isPlayer ? 11 : 1); // TODO: Real power level

      stream.writeVInt(1);
      stream.writeVInt(0);
  
      stream.writeVInt(0);
  
      stream.writeBoolean(hero.isPlayer);
      if (hero.isPlayer) {
        stream.writeLong(config.id.high, config.id.low);
      }

      // TODO: Thumb and name colour
      stream = new PlayerDisplayData(hero.name, 0, 0).encode(stream);

      stream.writeBoolean(false); // In club (todo)

      stream.writeVInt(0);

      stream.writeVInt(0);

      stream.writeVInt(0);
      stream.writeVInt(0);
      stream.writeInt(0);
      stream.writeInt(0);
      stream.writeDataReference(0, 1);
      stream.writeVInt(0);
      stream.writeVInt(0);
      stream.writeVInt(0);
    }

    stream.writeVInt(1); // xp entry count
    stream.writeVInt(1); // Trophies
    stream = new XpEntry(88000, 88000).encode(stream) // TODO: Current highest

    stream.writeVInt(0); // milestones progress

    stream.writeVInt(1);
    //sub
    stream.writeVInt(0);
    stream.writeVInt(0);
    stream.writeVInt(0);

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
    stream.writeBoolean(false);

    return stream.payload;
  }
}
