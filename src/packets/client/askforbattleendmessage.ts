import { ByteStream } from "../../misc/ByteStream.js";
import { Hero } from "../../misc/Hero.js";
import { BattleEndData } from "../../misc/BattleEndData.js";
import { Messaging } from "../../Messaging.js";
import { BattleEndMessage } from "../server/BattleEndMessage.js";

export class AskForBattleEndMessage {
  static decode(stream: ByteStream): BattleEndData {
    let result = stream.readVInt(); // Result (rank, if not applicable then 1)
    let result2 = stream.readVInt();   // BattleEnd type? (0: SD or 1: team - rank for sd limbo)
    let rank = stream.readVInt();   // Win Loss / Rank
    let mapID = stream.readDataReference();
    let heroes: Hero[] = [];
    let heroCount = stream.readVInt();
    for (let i = 0; i < heroCount; i++) {
      heroes.push(
        new Hero(
          stream.readDataReference(),
          stream.readDataReference(),
          stream.readVInt(),
          stream.readBoolean(),
          stream.readString(),
        ),
      );
    }

    return new BattleEndData(result, result2, rank, mapID, heroes);
  }

  static execute(data: BattleEndData): void {
    Messaging.sendOfflineMessage(23456, BattleEndMessage.encode(data));
  }
}
