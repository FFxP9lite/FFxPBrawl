import { Offsets } from "./Offsets";
import {
  base,
  config,
  createMessageByType,
  messageManagerReceiveMessage,
  operator_new,
} from "./Definitions";
import { PiranhaMessage } from "./PiranhaMessage";
import { getMessageManagerInstance } from "./util";
import { TeamManager } from "./teams/TeamManager";
import { OwnHomeDataMessage } from "src/packets/server/ownhomedatamessage/v59/OwnHomeDataMessage";
import { writeConfig } from "./Config";
import { PlayerProfileMessage } from "./packets/server/PlayerProfileMessage";
import { AvatarNameCheckRequestMessage } from "./packets/client/namechange/AvatarNameCheckMessage";
import { ByteStream } from "./misc/ByteStream";
import { ChangeAvatarNameMessage } from "./packets/client/namechange/ChangeAvatarNameMessage";
import { EndClientTurnMessage } from "./packets/client/EndClientTurnMessage";
import { SetSupportedCreatorMessage } from "./packets/client/SetSupportedCreatorMessage";
import { CreatePlayerMapMessage } from "./packets/client/mapmaker/CreatePlayerMapMessage";
import { PlayerMapsMessage } from "./packets/server/mapmaker/PlayerMapsMessage";
import { DeletePlayerMapMessage } from "./packets/client/mapmaker/DeletePlayerMapMessage";
import { TeamCreateMessage } from "./packets/client/teams/TeamCreateMessage";
import { Logger } from "./utility/Logger";
import { LoginOkMessage } from "./packets/server/LoginOkMessage";
import { AskForBattleEndMessage } from "./packets/client/AskForBattleEndMessage";
import { SetCountryMessage } from "./packets/client/SetCountryMessage";
import { UpdatePlayerMapMessage } from "./packets/client/mapmaker/UpdatePlayerMapMessage";
import { ChangePlayerMapNameMessage } from "./packets/client/mapmaker/ChangePlayerMapNameMessage";
import { TeamLeftMessage } from "./packets/server/teams/teamleftmessage";
import { TeamSetLocationMessage } from "./packets/client/teams/TeamSetLocationMessage";
import { TeamSetMemberReadyMessage } from "./packets/client/teams/TeamSetMemberReadyMessage";
import { TeamSetPlayerMapMessage } from "./packets/client/teams/TeamSetPlayerMapMessage";
import { TeamBotSlotDisableMessage } from "./packets/client/teams/TeamBotSlotDisableMessage";

export class Messaging {
  static sendOfflineMessage(id: number, payload: number[]): NativePointer {
    let version = id == 20104 ? 1 : 0;
    let useOperator = (id === 23456 || id === 12103)
    let doNoCopyFix = (id === 23456) // TODO: Very jank
    const factory = Memory.alloc(512);
    factory.writePointer(base.add(Offsets.LogicLaserMessageFactory));
    let message = createMessageByType(factory, id);
    message.add(Offsets.Version).writeS32(version);
    const payloadLength = PiranhaMessage.getByteStream(message).add(
      Offsets.PayloadSize,
    );
    payloadLength.writeS32(payload.length);
    if (payload.length > 0) {
      let payloadPtr;
      if (useOperator)
        payloadPtr = operator_new(payload.length).writeByteArray(payload);
      else
        payloadPtr = Memory.alloc(payload.length).writeByteArray(payload);
      const bytestream = PiranhaMessage.getByteStream(message);
      bytestream.add(Offsets.PayloadPtr).writePointer(payloadPtr);        // buffer ptr
      if (doNoCopyFix) {
        // To fix No message bytestream to copy we skip the decode below
        // Then it complains about write offset being 0
        // So we set it here
        bytestream.add(40).writeS32(payload.length);        // capacity
        bytestream.add(20).writeS32(payload.length);        // write offset
      }
    }
    let decodeOffset = message.readPointer().add(Offsets.Decode).readPointer();
    Logger.debug("Decode function for type", id + ":", decodeOffset.sub(base));
    let decode = new NativeFunction(decodeOffset, "void", ["pointer"]);
    if (!doNoCopyFix) decode(message);
    Logger.debug("Message decoded succesfully");
    messageManagerReceiveMessage(getMessageManagerInstance(), message);
    Logger.debug("Message received");
    return message;
  }

  static handleMessage(id: number, stream: ByteStream) {
    switch (id) {
      // ClientHelloMessage
      case 10100: {
        Messaging.sendOfflineMessage(20104, LoginOkMessage.encode());
        Messaging.sendOfflineMessage(24101, OwnHomeDataMessage.encode());
        if (config.teamExperiment) {
          TeamManager.createTeam();
        }
        break;
      }
      // GoHomeFromOfflinePracticeMesage
      case 17750:
      // GoHomeFromMapEditorMessage
      case 12108: {
        if (config.tutorial) {
          config.tutorial = false;
          writeConfig(config);
        }
        Messaging.sendOfflineMessage(24101, OwnHomeDataMessage.encode());
        if (config.teamExperiment) {
          TeamManager.createTeam();
        }
        break;
      }
      // AskForBattleEndMessage
      case 14110: {
        AskForBattleEndMessage.execute(AskForBattleEndMessage.decode(stream));
        break;
      }
      // GetPlayerProfileMessage
      case 15081: {
        // we dont need payload for now
        Messaging.sendOfflineMessage(24113, PlayerProfileMessage.encode());
        break;
      }
      // AvatarNameCheckRequestMessage
      case 14600: {
        AvatarNameCheckRequestMessage.execute(
          AvatarNameCheckRequestMessage.decode(stream),
        );
        break;
      }
      // ChangeAvatarNameMessage
      case 10212: {
        ChangeAvatarNameMessage.execute(ChangeAvatarNameMessage.decode(stream));
        break;
      }
      case 14102: {
        EndClientTurnMessage.execute(EndClientTurnMessage.decode(stream));
        break;
      }
      case 18686: {
        SetSupportedCreatorMessage.execute(
          SetSupportedCreatorMessage.decode(stream),
        );
        break;
      }
      case 12100: {
        CreatePlayerMapMessage.execute(CreatePlayerMapMessage.decode(stream));
        break;
      }
      case 12103: {
        UpdatePlayerMapMessage.execute(UpdatePlayerMapMessage.decode(stream));
        break;
      }
      case 12106: {
        ChangePlayerMapNameMessage.execute(ChangePlayerMapNameMessage.decode(stream))
      }
      case 12102: {
        Messaging.sendOfflineMessage(22102, PlayerMapsMessage.encode());
        break;
      }
      case 12101: {
        DeletePlayerMapMessage.execute(DeletePlayerMapMessage.decode(stream));
        break;
      }
      case 12998: {
        SetCountryMessage.execute(SetCountryMessage.decode(stream));
        break;
      }
      case 12541: {
        TeamManager.createTeam()
        break
      }
      case 14350: {
        Logger.verbose('"Unused" TeamCreateMessage is used')
        TeamCreateMessage.execute(TeamCreateMessage.decode(stream));
        break;
      }
      case 14353: { // TeamLeaveMessage
        Messaging.sendOfflineMessage(24125, TeamLeftMessage.encode())
        break
      }
      case 14363: {
        TeamSetLocationMessage.execute(TeamSetLocationMessage.decode(stream))
        break
      }
      case 14373: {
        TeamBotSlotDisableMessage.execute(TeamBotSlotDisableMessage.decode(stream))
        break
      }
    }
  }
}
