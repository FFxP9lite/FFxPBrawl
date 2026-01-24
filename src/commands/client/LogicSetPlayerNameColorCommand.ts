import { ByteStream } from "../../misc/ByteStream.js";
import { writeConfig } from "../../Config.js";
import { config } from "../../Definitions.js";
import { LogicCommand } from "../../misc/LogicCommand.js";
import { Logger } from "../../utility/Logger.js";

export class LogicSetPlayerNameColorCommand {
  static decode(stream: ByteStream): any {
    stream = LogicCommand.decode(stream);
    let namecolor = stream.readDataReference().low;
    return { stream, namecolor };
  }

  static execute(colorID: number) {
    Logger.verbose("New color id:", colorID);
    config.namecolor = colorID;
    writeConfig(config);
  }
}
