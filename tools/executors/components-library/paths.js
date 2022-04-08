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
var devkit_1 = require("@nrwl/devkit");
var path_1 = require("path");
var utils_1 = require("./utils");
function componentsLibraryPathsExecutor(options, context) {
    return __awaiter(this, void 0, void 0, function () {
        var packageJson, tsConfigPath, tsConfig, realConfig, prePaths, postPaths, libPaths, isPost, key, isCurrentLib, key, generatedConfig;
        return __generator(this, function (_a) {
            options.cwd = context.workspace.projects[context.projectName].root;
            packageJson = (0, devkit_1.readJsonFile)((0, path_1.join)(options.cwd, 'package.json'));
            tsConfigPath = (0, path_1.join)(context.root, options.name);
            tsConfig = (0, devkit_1.readJsonFile)(tsConfigPath);
            realConfig = JSON.stringify(tsConfig);
            prePaths = {};
            postPaths = {};
            libPaths = {};
            isPost = false;
            for (key in tsConfig.compilerOptions.paths) {
                isCurrentLib = key.includes(packageJson.name);
                if (!isPost && !isCurrentLib) {
                    prePaths[key] = tsConfig.compilerOptions.paths[key];
                }
                if (isPost && !isCurrentLib) {
                    postPaths[key] = tsConfig.compilerOptions.paths[key];
                }
                if (isCurrentLib) {
                    if (!isPost) {
                        isPost = true;
                    }
                    delete tsConfig.compilerOptions.paths[key];
                }
            }
            (0, utils_1.libDirsNormalizer)(options, function (dir) {
                var dirName = dir.name;
                var pathKey = dirName === 'src' ? '' : "/" + dirName;
                libPaths["" + packageJson.name + pathKey] = [
                    options.cwd + "/" + dirName + "/index.ts",
                ];
            });
            if (packageJson.exports) {
                for (key in packageJson.exports) {
                    libPaths[packageJson.name + "/" + key] = [
                        (0, path_1.join)(options.cwd, packageJson.exports[key]["default"].replace(/.js$/, '.ts')),
                    ];
                }
            }
            tsConfig.compilerOptions.paths = __assign(__assign(__assign({}, prePaths), libPaths), postPaths);
            generatedConfig = JSON.stringify(tsConfig);
            if (!options.update && generatedConfig !== realConfig) {
                console.error("Please, update " + options.name);
                return [2 /*return*/, { success: false }];
            }
            if (options.update) {
                (0, devkit_1.writeJsonFile)(tsConfigPath, tsConfig);
            }
            return [2 /*return*/, { success: true }];
        });
    });
}
exports["default"] = componentsLibraryPathsExecutor;
