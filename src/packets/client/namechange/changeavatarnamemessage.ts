import { ByteStream } from "../../../misc/ByteStream.js";
import { Messaging } from "../../../Messaging.js";
import { LogicChangeAvatarNameCommand } from "../../../commands/server/LogicChangeAvatarNameCommand.js";
import { config } from "../../../Definitions.js";
import { writeConfig } from "../../../Config.js";
import { Logger } from "../../../utility/Logger.js";

export class ChangeAvatarNameMessage {
  static decode(stream: ByteStream): string {
    return stream.readString(); // theres also a bool but who gives a shit
  }

  static execute(name: string): void {
    config.name = name;
    config.registered = true;
    writeConfig(config);
    Logger.verbose("Changed name to", name);
    Messaging.sendOfflineMessage(24111, LogicChangeAvatarNameCommand.encode());
  }
}
