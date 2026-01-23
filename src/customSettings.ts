import {
  base,
  config,
  getFontSize,
  getHeight,
  getTextFieldByName,
  getWidth,
  getX,
  getY,
  setXY,
  stringCtor,
} from "./Definitions";
import { Offsets } from "./Offsets";
import { Logger } from "./utility/Logger";
import { ButtonHelper } from "./utility/ButtonHelper";
import { decodeString } from "./util";

let editControlsPos: any;
let editConfigPos: any;
let guiContainer: NativePointer;

export function setupCustomSettings() {
  Interceptor.attach(base.add(Offsets.SettingsScreenConstructor), {
    onEnter(args) {
      guiContainer = args[0];
      this.setTextHook = Interceptor.attach(base.add(Offsets.SetText), {
        onEnter(args) {
          if (decodeString(args[1]) == "SUPERCELL ID") {
            stringCtor(args[1], Memory.allocUtf8String(""));
          }
        },
      });
      this.addGameBtnHook = Interceptor.attach(
        base.add(Offsets.AddGameButton),
        {
          onEnter(args) {
            this.name = args[1].readCString();
            //Logger.verbose("Adding button with name", this.name);
          },
          onLeave(btn) {
            if (this.name == "button_parentsguide") {
              editControlsPos = { x: getX(btn), y: getY(btn) };
            } else if (this.name == "button_edit_controls") {
              setXY(btn, editControlsPos.x, editControlsPos.y);
            } else if (this.name == "button_random_reward_rates") {
              editConfigPos = { x: getX(btn), y: getY(btn) };
            }
            if (config.hiddenSettingsButtons.includes(this.name)) {
              ButtonHelper.hideButton(btn);
            }
          },
        },
      );
    },
    onLeave() {
      this.addGameBtnHook.detach();
      this.setTextHook.detach();
      // soon
    },
  });
}
