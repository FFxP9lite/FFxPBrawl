import { ByteStream } from "../../../misc/ByteStream.js";

export class AvatarNameCheckResponseMessage {
  static encode(name: string): number[] {
    let stream = new ByteStream([]);

    stream.writeBoolean(false);
    stream.writeInt(0);
    stream.writeString(name);

    return stream.payload;
  }
}

