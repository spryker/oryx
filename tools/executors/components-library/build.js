"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var devkit_1 = require("@nx/devkit");
var copy_assets_handler_1 = require("@nx/js/src/utils/assets/copy-assets-handler");
var run_commands_impl_1 = require("nx/src/executors/run-commands/run-commands.impl");
var fs_1 = require("fs");
var path_1 = require("path");
var utils_1 = require("./utils");
var normalizeOptions = function (options) {
    options = __assign({}, options);
    options.outputPath = (0, path_1.join)(options.outputPath, options.cwd);
    options.main = (0, path_1.join)(options.cwd, options.main);
    return options;
};
function componentsLibraryBuildExecutor(baseOptions, context) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var projectRoot, options, packageJson, tmpPath, assetHandler;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    baseOptions.cwd = context.workspace.projects[context.projectName].root;
                    projectRoot = (0, devkit_1.joinPathFragments)(context.root, baseOptions.cwd);
                    options = normalizeOptions(baseOptions);
                    packageJson = (0, devkit_1.readJsonFile)((0, path_1.join)(options.cwd, 'package.json'));
                    tmpPath = (0, path_1.join)(context.root, 'tmp');
                    packageJson.exports = (_a = packageJson.exports) !== null && _a !== void 0 ? _a : {};
                    return [4 /*yield*/, (0, run_commands_impl_1.default)({
                            command: "npx tsc ".concat(baseOptions.tsConfig ? '-p ' + baseOptions.tsConfig : ''),
                            cwd: projectRoot,
                            __unparsed__: [],
                        }, context)];
                case 1:
                    _b.sent();
                    if (!options.assets) return [3 /*break*/, 3];
                    assetHandler = new copy_assets_handler_1.CopyAssetsHandler({
                        projectDir: projectRoot,
                        rootDir: options.cwd,
                        outputDir: options.outputPath,
                        assets: options.assets,
                    });
                    return [4 /*yield*/, assetHandler.processAllAssetsOnce()];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    (0, utils_1.libDirsNormalizer)(options, function (dir) {
                        var dirName = dir.name, dirPath = dir.path;
                        var dirKey = dirName === 'src' ? '.' : "./".concat(dirName);
                        packageJson.exports[dirKey] = {
                            types: "./".concat(dirPath, "/index.d.ts"),
                            default: "./".concat(dirPath, "/index.js"),
                        };
                    });
                    (0, devkit_1.writeJsonFile)((0, path_1.join)(options.outputPath, 'package.json'), packageJson);
                    if ((0, fs_1.existsSync)(tmpPath)) {
                        (0, fs_1.rmdirSync)(tmpPath, { recursive: true });
                    }
                    return [2 /*return*/, { success: true }];
            }
        });
    });
}
exports.default = componentsLibraryBuildExecutor;
