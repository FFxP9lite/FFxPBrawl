import { deleteMap } from "src/mapmaker.js";
import { ByteStream } from "../../../misc/ByteStream.js";
import { Long } from "../../../Long.js";

export class DeletePlayerMapResponseMessage {
  static encode(id: Long): number[] {
    let stream = new ByteStream([]);

    stream.writeVInt(Number(!deleteMap([id.high, id.low]))); // err
    stream.writeVLong(id.high, id.low);

    return stream.payload;
  }
}
