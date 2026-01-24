import { ByteStream } from "../../../misc/ByteStream.js";
import { Messaging } from "../../../Messaging.js";
import { AvatarNameCheckResponseMessage } from "../../server/namechange/AvatarNameCheckResponseMessage.js";

export class AvatarNameCheckRequestMessage {
  static decode(stream: ByteStream): string {
    return stream.readString();
  }

  static execute(name: string): void {
    Messaging.sendOfflineMessage(
      20300,
      AvatarNameCheckResponseMessage.encode(name),
    );
  }
}
