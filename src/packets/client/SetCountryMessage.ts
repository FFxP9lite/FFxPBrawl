import { ByteStream } from "../../misc/ByteStream.js";
import { Messaging } from "../../Messaging.js";
import { config } from "../../Definitions.js";
import { writeConfig } from "../../Config.js";
import { Logger } from "../../utility/Logger.js";
import { Long } from "../../Long.js";
import { SetCountryResponseMessage } from "../server/SetCountryResponseMessage.js";

export class SetCountryMessage {
  static decode(stream: ByteStream): Long {
    return stream.readDataReference();
  }

  static execute(region: Long): void {
    Logger.verbose("Changed country to", region.low)
    Messaging.sendOfflineMessage(24178, SetCountryResponseMessage.encode(region))
  }
}
