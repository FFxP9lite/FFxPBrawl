import { ByteStream } from "../../misc/ByteStream.js";
import { config } from "../../Definitions.js";
import { LogicCommand } from "../../misc/LogicCommand.js";

export class LogicChangeAvatarNameCommand {
  static encode(): number[] {
    let stream = new ByteStream([]);

    stream.writeVInt(201);
    stream.writeString(config.name);
    stream.writeVInt(0);
    stream.payload.concat(LogicCommand.encode());

    return stream.payload;
  }
}
