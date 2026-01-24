import { ByteStream } from "../../misc/ByteStream.js";
import { LogicCommand } from "../../misc/LogicCommand.js";
import { config } from "../../Definitions.js";

export class LogicSetSupportedCreatorCommand {
  static encode(): number[] {
    let stream = new ByteStream([]);

    stream.writeVInt(215);
    stream.writeBoolean(true);
    stream.writeString(config.supportedCreator);
    stream.payload.concat(LogicCommand.encode());

    return stream.payload;
  }
}
