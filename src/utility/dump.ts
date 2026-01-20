// This is a simple tool to dump structure

import { base } from "../Definitions";
import { GlobalID } from "../GlobalID";
import { Offsets } from "../Offsets";
import { decodeString } from "../util";
import { Logger } from "./Logger";

export class Dumper {
  // hooks
  // writes
  writeDataReference: InvocationListener | undefined = undefined;
  writeVInt: InvocationListener | undefined = undefined;
  writeInt: InvocationListener | undefined = undefined;
  writeBoolean: InvocationListener | undefined = undefined;
  writeLongLong: InvocationListener | undefined = undefined;
  writeString: InvocationListener | undefined = undefined;
  writeVLong: InvocationListener | undefined = undefined;
  // reads
  readGlobalID: InvocationListener | undefined = undefined;
  readVInt: InvocationListener | undefined = undefined;
  readInt: InvocationListener | undefined = undefined;
  readBoolean: InvocationListener | undefined = undefined;
  readLongLong: InvocationListener | undefined = undefined;
  readString: InvocationListener | undefined = undefined;
  decodeLogicLong: InvocationListener | undefined = undefined;

  id = 0;
  isWritingElsewhere = false;
  reverse = false;

  constructor(reverse = false) {
    this.reverse = reverse;
  }

  dump(name: string, offset: number) {
    const addr = base.add(offset);
    const self = this;
    Interceptor.attach(addr, {
      onEnter() {
        Logger.debug("Dumping packet");
        self.hookWrites(name);
        self.hookReads(name);
      },
      onLeave() {
        self.detachWrites();
        self.detachReads();
        self.id++;
        Logger.debug("Finished dumping packet");
      },
    });
  }

  getModeForWrite(): string {
    return this.reverse ? "read" : "write";
  }

  getModeForRead(): string {
    return this.reverse ? "write" : "read";
  }

  hookWrites(name: string) {
    const self = this;

    this.writeDataReference = Interceptor.attach(
      base.add(Offsets.WriteDataReference),
      {
        onEnter(args) {
          if (self.isWritingElsewhere) {
            this.disable = true;
            return;
          }
          self.isWritingElsewhere = true;

          if (args[1].isNull()) {
            let message = `stream.${self.getModeForWrite()}VInt(0);`;

            send({
              type: "dump",
              name: name,
              data: message,
              id: self.id,
            });
          } else {
            const globalID = args[1].add(Offsets.GlobalID).readInt();
            const classID = GlobalID.getClassID(globalID);
            const instanceID = GlobalID.getInstanceID(globalID);
            let message = `stream.${self.getModeForWrite()}DataReference(${classID}, ${instanceID});`;
            send({
              type: "dump",
              name: name,
              data: message,
              id: self.id,
            });
          }
        },
        onLeave() {
          if (!this.disable) {
            self.isWritingElsewhere = false;
          }
        },
      },
    );

    this.writeVInt = Interceptor.attach(base.add(Offsets.WriteVInt), {
      onEnter(args) {
        if (self.isWritingElsewhere) {
          this.disable = true;
          return;
        }
        self.isWritingElsewhere = true;

        let message = `stream.${self.getModeForWrite()}VInt(${args[1].toInt32()});`;
        send({
          type: "dump",
          name: name,
          data: message,
          id: self.id,
        });
      },
      onLeave() {
        if (!this.disable) {
          self.isWritingElsewhere = false;
        }
      },
    });

    this.writeBoolean = Interceptor.attach(base.add(Offsets.WriteBoolean), {
      onEnter(args) {
        if (self.isWritingElsewhere) {
          this.disable = true;
          return;
        }
        self.isWritingElsewhere = true;

        let message = `stream.${self.getModeForWrite()}Boolean(${Boolean(args[1].toInt32())});`;
        send({
          type: "dump",
          name: name,
          data: message,
          id: self.id,
        });
      },
      onLeave() {
        if (this.disable) {
          this.disable = false;
          return;
        }
        self.isWritingElsewhere = false;
      },
    });

    /*
    this.writeLongLong = Interceptor.attach(base.add(Offsets.WriteLongLong), {
      onEnter(args) {
        if (self.isWritingElsewhere) {
          this.disable = true;
          return;
        }
        Logger.info("WriteLongLong", args[1].toInt32());
      },
      onLeave() {
        if (!this.disable) {
          self.isWritingElsewhere = false;
        } else {
          return;
        }
      },
    });
    */

    this.writeString = Interceptor.attach(base.add(Offsets.WriteString), {
      onEnter(args) {
        if (self.isWritingElsewhere) {
          this.disable = true;
          return;
        }
        self.isWritingElsewhere = true;

        let message = `stream.${self.getModeForWrite()}String("${decodeString(args[1])}");`;
        send({
          type: "dump",
          name: name,
          data: message,
          id: self.id,
        });
      },
      onLeave() {
        if (this.disable) {
          this.disable = false;
          return;
        }
        self.isWritingElsewhere = false;
      },
    });
  }

  hookReads(name: string) {
    const self = this;

    this.readGlobalID = Interceptor.attach(base.add(Offsets.ReadGlobalID), {
      onEnter() {
        if (self.isWritingElsewhere) {
          this.disable = true;
          return;
        }
        self.isWritingElsewhere = true;
      },
      onLeave(retval) {
        if (this.disable) {
          this.disable = false;
          return;
        }
        self.isWritingElsewhere = false;

        const globalID = retval.toInt32();
        const classID = GlobalID.getClassID(globalID);
        const instanceID = GlobalID.getInstanceID(globalID);
        let message: string;
        if (globalID == 0) {
          message = `stream.${self.getModeForRead()}VInt(0);`;
        } else {
          message = `stream.${self.getModeForRead()}DataReference(${classID}, ${instanceID});`;
        }
        send({
          type: "dump",
          name: name,
          data: message,
          id: self.id,
        });
      },
    });

    this.readVInt = Interceptor.attach(base.add(Offsets.ReadVInt), {
      onEnter() {
        if (self.isWritingElsewhere) {
          this.disable = true;
          return;
        }
        self.isWritingElsewhere = true;
      },
      onLeave(retval) {
        if (this.disable) {
          this.disable = false;
          return;
        }
        self.isWritingElsewhere = false;

        let message = `stream.${self.getModeForRead()}VInt(${retval.toInt32()});`;
        send({
          type: "dump",
          name: name,
          data: message,
          id: self.id,
        });
      },
    });

    this.readBoolean = Interceptor.attach(base.add(Offsets.ReadBoolean), {
      onEnter() {
        if (self.isWritingElsewhere) {
          this.disable = true;
          return;
        }
        self.isWritingElsewhere = true;
      },
      onLeave(retval) {
        if (this.disable) {
          this.disable = false;
          return;
        }
        self.isWritingElsewhere = false;

        let message = `stream.${self.getModeForRead()}Boolean(${Boolean(retval.toInt32())});`;
        send({
          type: "dump",
          name: name,
          data: message,
          id: self.id,
        });
      },
    });

    this.decodeLogicLong = Interceptor.attach(
      base.add(Offsets.DecodeLogicLong),
      {
        onEnter(args) {
          if (self.isWritingElsewhere) {
            this.disable = true;
            return;
          }
          self.isWritingElsewhere = true;
          this.long = args[1];
        },
        onLeave(retval) {
          if (this.disable) {
            this.disable = false;
            return;
          }
          self.isWritingElsewhere = false;
          const a1 = this.long.readS32();
          const a2 = this.long.add(4).readS32();

          let message = `stream.${self.getModeForRead()}VLong(${a1}, ${a2});`;
          send({
            type: "dump",
            name: name,
            data: message,
            id: self.id,
          });
        },
      },
    );
  }

  detachWrites() {
    this.writeDataReference?.detach();
    this.writeVInt?.detach();
    this.writeBoolean?.detach();
    this.writeLongLong?.detach();
    this.writeString?.detach();
  }

  detachReads() {
    this.readGlobalID?.detach();
    this.readVInt?.detach();
    this.readBoolean?.detach();
    this.readLongLong?.detach();
    this.readString?.detach();
    this.decodeLogicLong?.detach();
  }
}
