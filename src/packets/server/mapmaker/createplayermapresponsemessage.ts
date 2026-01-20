import { ByteStream } from "../../../misc/ByteStream";
import { PlayerMap } from "../../../misc/PlayerMap";

export class CreatePlayerMapResponseMessage {
  static encode(map: PlayerMap): number[] {
    let stream = new ByteStream([]);

    stream.writeVInt(0);
    stream.writeBoolean(true);
    stream = map.encode(stream);

    return stream.payload;
  }
}
