"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs_1 = require("fs");
var path_1 = require("path");
var typescript_1 = require("typescript");
function echoExecutor(options, context) {
    return __awaiter(this, void 0, void 0, function () {
        var cwd, tmpDir, tmpSprite, pathToFolder, removeTmpDir, iconsPath, program, files, _i, files_1, file, contents, icons, svgTemplate, templates, i, icon, sprites, output, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cwd = context.workspace.projects[context.projectName].root;
                    tmpDir = "tmpSprite";
                    tmpSprite = context.root + "/" + tmpDir;
                    pathToFolder = (0, path_1.dirname)(options.input);
                    removeTmpDir = function () {
                        if ((0, fs_1.existsSync)("" + tmpSprite)) {
                            (0, fs_1.rmdirSync)("" + tmpSprite, { recursive: true });
                        }
                    };
                    console.info("Getting the location of icon files");
                    iconsPath = (0, path_1.resolve)(cwd, options.input);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    console.info("Icon generating program");
                    return [4 /*yield*/, (0, typescript_1.createProgram)([iconsPath], {
                            moduleResolution: typescript_1.ModuleResolutionKind.NodeJs,
                            target: typescript_1.ScriptTarget.ES2020,
                            module: typescript_1.ModuleKind.CommonJS,
                            outDir: tmpDir,
                            skipLibCheck: true,
                            skipDefaultLibCheck: true
                        })];
                case 2:
                    program = _b.sent();
                    program.emit();
                    files = (0, fs_1.readdirSync)(tmpSprite + "/" + pathToFolder);
                    for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                        file = files_1[_i];
                        contents = (0, fs_1.readFileSync)(tmpSprite + "/" + pathToFolder + "/" + file, {
                            encoding: 'utf-8'
                        });
                        contents = contents
                            .replace(/\(.*\.svg\)/g, '')
                            .replace(/(?:const|let).*require.*lit.*;/, '');
                        (0, fs_1.writeFileSync)(tmpSprite + "/" + pathToFolder + "/" + file, contents);
                    }
                    return [4 /*yield*/, Promise.resolve().then(function () { return require(tmpSprite + "/" + options.input.replace('.ts', '.js')); })];
                case 3:
                    icons = _b.sent();
                    console.info("Convert icons to the correct structure");
                    svgTemplate = function (id, value) { return "<symbol id=\"" + id + "\">" + value + "</symbol>"; };
                    templates = [];
                    for (i in icons) {
                        icon = icons[i];
                        templates.push(svgTemplate(icon.type, icon.source));
                    }
                    console.info("Generating sprite");
                    sprites = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n      <svg version=\"1.1\"\n        xmlns=\"http://www.w3.org/2000/svg\"\n        xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n          " + templates.join('\n') + "\n      </svg>";
                    console.info("Collected sprite record");
                    output = (0, path_1.resolve)(cwd, options.output);
                    if (!(0, fs_1.existsSync)((0, path_1.dirname)(output))) {
                        (0, fs_1.mkdirSync)((0, path_1.dirname)(output), { recursive: true });
                    }
                    (0, fs_1.writeFileSync)(output, sprites);
                    removeTmpDir();
                    return [2 /*return*/, { success: true }];
                case 4:
                    _a = _b.sent();
                    removeTmpDir();
                    return [2 /*return*/, { success: false }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports["default"] = echoExecutor;
