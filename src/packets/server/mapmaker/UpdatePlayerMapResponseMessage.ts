import { ByteStream } from "../../../misc/ByteStream.js";
import { Long } from "../../../Long.js";

export class UpdatePlayerMapResponseMessage {
  static encode(id: Long): number[] {
    let stream = new ByteStream([]);

    stream.writeVInt(0); // err
    stream.writeVLong(id.high, id.low);

    return stream.payload;
  }
}