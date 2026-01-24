import { config } from "../../Definitions.js";
import { ByteStream } from "../../misc/ByteStream.js";

export class SetSupportedCreatorResponseMessage {
  static encode(): number[] {
    let stream = new ByteStream([]);

    stream.writeVInt(1);
    stream.writeString(config.supportedCreator);

    return stream.payload;
  }
}
