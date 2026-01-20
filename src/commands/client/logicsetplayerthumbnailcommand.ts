import { ByteStream } from "../../misc/ByteStream.js";
import { writeConfig } from "../../Config.js";
import { config } from "../../Definitions.js";
import { LogicCommand } from "../../misc/LogicCommand.js";
import { Logger } from "../../utility/Logger.js";

export class LogicSetPlayerThumbnailCommand {
  static decode(stream: ByteStream): any {
    stream = LogicCommand.decode(stream);
    let thumbnail = stream.readDataReference().low;
    return { stream, thumbnail };
  }

  static execute(thumbnailID: number) {
    Logger.verbose("New thumbnail id:", thumbnailID);
    config.thumbnail = thumbnailID;
    writeConfig(config);
  }
}
