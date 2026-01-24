import { ByteStream } from "../misc/ByteStream.js";
import { config } from "../Definitions.js";
import { PlayerDisplayData } from "../misc/PlayerDisplayData.js";

export class LogicPlayerBattleIntroDetails {
  static encode(stream: ByteStream): ByteStream {
    let displayData = new PlayerDisplayData(
      config.name,
      config.thumbnail,
      config.namecolor,
    );
    stream = displayData.encode(stream);

    return stream;
  }
}
