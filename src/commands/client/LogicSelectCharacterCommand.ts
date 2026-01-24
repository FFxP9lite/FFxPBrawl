import { ByteStream } from "../../misc/ByteStream.js";
import { writeConfig } from "../../Config.js";
import { config } from "../../Definitions.js";
import { LogicCommand } from "../../misc/LogicCommand.js";
import { Logger } from "../../utility/Logger.js";

export class LogicSelectCharacterCommand {
  static decode(stream: ByteStream): any {
    stream = LogicCommand.decode(stream);
    let character = stream.readDataReference().low;
    return { stream, character };
  }

  static execute(brawlerID: number) {
    Logger.verbose("New brawler id:", brawlerID);
    config.selectedBrawlers[0] = brawlerID;
    writeConfig(config);
  }
}
