export class fs {
    static open = new NativeFunction(Module.getExportByName(null, "open"), "int", ["pointer", "int", "int"]);
    static write = new NativeFunction(Module.getExportByName(null, "write"), "int", ["int", "pointer", "int"]);
    static close = new NativeFunction(Module.getExportByName(null, "close"), "int", ["int"]);
    static mkdir = new NativeFunction(Module.getExportByName(null, "mkdir"), "int", ["pointer", "int"]);
    static read = new NativeFunction(Module.getExportByName(null, "read"), "int", ["int", "pointer", "int"]);
    static opendir = new NativeFunction(Module.getExportByName(null, "opendir"), "pointer", ["pointer"]);
    static readdir = new NativeFunction(Module.getExportByName(null, "readdir"), "pointer", ["pointer"]);
    static closedir = new NativeFunction(Module.getExportByName(null, "closedir"), "int", ["pointer"]);
    static unlink = new NativeFunction(Module.getExportByName(null, "unlink"), "int", ["pointer"]);
    static rename = new NativeFunction(Module.getExportByName(null, "rename"), "int", ["pointer", "pointer"]);
}