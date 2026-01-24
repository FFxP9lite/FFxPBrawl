import { ByteStream } from "../../../misc/ByteStream.js";
import { Messaging } from "../../../Messaging.js";
import { Long } from "../../../Long.js";
import { UpdatePlayerMapResponseMessage } from "../../server/mapmaker/UpdatePlayerMapResponseMessage.js";
import { utf8ArrayToString } from "src/util.js";
import { writeMapToFile } from "src/mapmaker.js";
import { Logger } from "src/utility/Logger.js";
import { zlib } from "src/utility/zlib.js";

export class UpdatePlayerMapMessage {
  static decode(stream: ByteStream): Long {
    let id = stream.readVLongAsLong(); // map id

    let compressedMapStrLength = stream.readBytesLength()
    let compressedMapByteArray = []
    console.log(compressedMapStrLength)
    for (let i = 0; i < compressedMapStrLength; i++) {
      compressedMapByteArray.push(stream.readByte())
    }

    const input = new Uint8Array(compressedMapByteArray.splice(4));
    Logger.verbose("Extra bytes:", compressedMapByteArray)

    let text = zlib.decompress(input)
    Logger.verbose(`Updating map ${id.high}, ${id.low}\n` + text);

    let modifiers = text.match(/M (\d+ ?)+\n/)
    if (modifiers !== null) { // TODO
      Logger.verbose("Dropping", modifiers[0])
      text = text.replace(modifiers[0], "")
    }

    writeMapToFile([id.high, id.low], "", -1, -1, text, true)

    return id;
  }

  static execute(id: Long): void {
    Messaging.sendOfflineMessage(
      22103,
      UpdatePlayerMapResponseMessage.encode(id),
    );
  }
}