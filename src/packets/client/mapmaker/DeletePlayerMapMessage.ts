import { ByteStream } from "../../../misc/ByteStream.js";
import { Messaging } from "../../../Messaging.js";
import { Long } from "../../../Long.js";
import { DeletePlayerMapResponseMessage } from "../../server/mapmaker/DeletePlayerMapResponseMessage.js";

export class DeletePlayerMapMessage {
  static decode(stream: ByteStream): Long {
    let id = stream.readVLongAsLong(); // map id
    return id;
  }

  static execute(id: Long): void {
    Messaging.sendOfflineMessage(
      22101,
      DeletePlayerMapResponseMessage.encode(id),
    );
  }
}
