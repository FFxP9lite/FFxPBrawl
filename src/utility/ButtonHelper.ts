import { Offsets } from "../Offsets";
import {
  addChild,
  autoAdjustText,
  ButtonHandler,
  buttonHandlers,
  gameButtonConstructor,
  getMovieClip,
  getTextFieldByName,
  gotoAndStop,
  malloc,
  setFontSize,
  setHeight,
  setMultiline,
  setText,
  setVerticallyCentered,
  setWidth,
  setXY,
} from "../Definitions.js";
import { createStringObject } from "../util.js";
import { Logger } from "./Logger";

export class ButtonHelper {
  static hideButton(displayObject: NativePointer) {
    setXY(displayObject, NaN, NaN);
  }

  static createButton(
    guiContainer: NativePointer,
    scFile: string,
    item: string,
    init = true,
    x: number,
    y: number,
    width: number | undefined = undefined,
    height: number | undefined = undefined,
    frameIndex: number | undefined = undefined,
  ): NativePointer {
    let btn = malloc(600);
    gameButtonConstructor(btn);
    let movieClip = getMovieClip(
      Memory.allocUtf8String(scFile),
      Memory.allocUtf8String(item),
      1,
    );
    if (frameIndex) gotoAndStop(movieClip, frameIndex);
    new NativeFunction(
      btn.readPointer().add(Offsets.InitFn).readPointer(),
      "void",
      ["pointer", "pointer", "bool"],
    )(btn, movieClip, Number(init));
    setXY(btn, x, y);
    if (width) setWidth(btn, width);
    if (height) setHeight(btn, height);
    addChild(guiContainer, btn);
    //Logger.debug("Added button");
    return btn;
  }

  static setButtonText(
    btn: NativePointer,
    textFieldName: string,
    text: string,
    multiline = false,
    centered = false,
    fontSize: number | undefined = undefined,
  ) {
    let textField = getTextFieldByName(
      btn.add(Offsets.ButtonText).readPointer(),
      Memory.allocUtf8String(textFieldName),
    );
    setText(textField, createStringObject(text));
    setMultiline(textField, Number(multiline));
    autoAdjustText(textField, 1, 1, 1);
    if (centered) setVerticallyCentered(textField);
    if (fontSize) setFontSize(textField, fontSize);
  }

  static setButtonHandler(ptr: NativePointer, handler: ButtonHandler): void {
    const entry = buttonHandlers.find((e) => e.ptr.equals(ptr));
    if (entry) {
      entry.handler = handler;
    } else {
      buttonHandlers.push({ ptr, handler });
    }
  }
}
