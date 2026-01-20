import { ButtonHandler, getHeight, getWidth, setXY } from "../Definitions";
import { Logger } from "../utility/Logger";
import { ButtonHelper } from "../utility/ButtonHelper";

export class DebugMenu {
  guiContainer: NativePointer;
  toggle: NativePointer = NULL;
  menu: NativePointer = NULL;
  menuVisible = true;
  debugPosition = 1225; // good is 1225; left 250
  start = 100;
  step = 55;
  next = this.start;

  constructor(guiContainer: NativePointer) {
    this.guiContainer = guiContainer;
    this.createDebugButton();
    this.createDebugMenu();
    this.hideDebugMenu();
    ButtonHelper.setButtonHandler(this.toggle, (button) =>
      this.onDebugButtonClick(button),
    );
    this.addDebugButton("Hello", (button) => Logger.debug("click"));
    this.addDebugButton("wow", (button) => Logger.debug("click"));
    this.addDebugButton("wow2", (button) => Logger.debug("click"));
    this.addDebugButton("wo3w", (button) => Logger.debug("click"));
    this.addDebugButton("wo4w", (button) => Logger.debug("click"));
  }

  onDebugButtonClick(button: NativePointer) {
    Logger.debug("Button clicked");
    if (button.equals(this.toggle)) this.toggleDebugMenu();
  }

  createDebugButton() {
    Logger.debug("Creating debug button");
    this.toggle = ButtonHelper.createButton(
      this.guiContainer,
      "sc/debug.sc",
      "debug_button",
      true,
      -40,
      575,
    );
    ButtonHelper.setButtonText(this.toggle, "txt", "D");
  }

  createDebugMenu() {
    Logger.debug("Creating debug menu");
    this.menu = ButtonHelper.createButton(
      this.guiContainer,
      "sc/debug.sc",
      "debug_menu",
      false,
      this.debugPosition,
      0,
    );

    ButtonHelper.setButtonText(this.menu, "title", "NBS Offline");
    ButtonHelper.setButtonText(this.menu, "version", "Beta 4 Testing");
    ButtonHelper.setButtonText(this.menu, "search_help", "Search...");
  }

  hideDebugMenu() {
    this.menuVisible = false;
    ButtonHelper.hideButton(this.menu);
  }

  showDebugMenu() {
    this.menuVisible = true;
    setXY(this.menu, this.debugPosition, 0);
  }

  toggleDebugMenu() {
    if (this.menuVisible) this.hideDebugMenu();
    else this.showDebugMenu();
  }

  addDebugButton(text: string, handler: ButtonHandler) {
    let btn = ButtonHelper.createButton(
      this.menu,
      "sc/debug.sc",
      "debug_menu_item",
      true,
      -165,
      this.next,
      265, // og 290
      50,
    );
    this.next += this.step;
    ButtonHelper.setButtonText(btn, "Text", text, false, true);
    ButtonHelper.setButtonHandler(btn, handler);
  }
}
