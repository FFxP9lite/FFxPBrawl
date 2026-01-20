import { ByteStream } from "../../misc/ByteStream.js";
import { writeConfig } from "../../Config.js";
import { config } from "../../Definitions.js";
import { LogicCommand } from "../../misc/LogicCommand.js";
import { Logger } from "../../utility/Logger.js";

export class LogicSelectSkinCommand {
  static decode(stream: ByteStream): any {
    stream = LogicCommand.decode(stream);
    let skin = stream.readDataReference().low;
    console.log("New skin id:", skin);
    let unk1 = stream.readVInt();
    return { stream, skin };
  }

  static execute(skinID: number) {
    Logger.verbose("New skin id:", skinID);
    // todo
  }
}
