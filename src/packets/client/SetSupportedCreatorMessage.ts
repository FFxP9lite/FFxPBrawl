import { ByteStream } from "../../misc/ByteStream.js";
import { Messaging } from "../../Messaging.js";
import { config } from "../../Definitions.js";
import { writeConfig } from "../../Config.js";
import { SetSupportedCreatorResponseMessage } from "../server/SetSupportedCreatorResponseMessage.js";
import { LogicSetSupportedCreatorCommand } from "../../commands/server/LogicSetSupportedCreatorCommand.js";
import { Logger } from "../../utility/Logger.js";

export class SetSupportedCreatorMessage {
  static decode(stream: ByteStream) {
    let ccc = stream.readString();
    return ccc;
  }

  static execute(ccc: string) {
    if (ccc == "") {
      Logger.debug("Clearing CCC");
    } else {
      Logger.debug("New CCC:", ccc);
    }

    let creatorCodes = config.creatorCodes.map((v) => v.toLowerCase());
    let cccLower = ccc.toLowerCase();

    if (
      ccc != "" &&
      !config.allCreatorCodesValid &&
      !creatorCodes.includes(cccLower)
    ) {
      return Messaging.sendOfflineMessage(
        28686,
        SetSupportedCreatorResponseMessage.encode(),
      );
    }

    if (ccc != "") {
      let correctCaseIndex = creatorCodes.indexOf(cccLower);
      config.supportedCreator = config.creatorCodes[correctCaseIndex];
    } else {
      config.supportedCreator = "";
    }

    writeConfig(config);

    Messaging.sendOfflineMessage(
      24111,
      LogicSetSupportedCreatorCommand.encode(),
    );
  }
}
