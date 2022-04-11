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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var devkit_1 = require("@nrwl/devkit");
var cypress = require("cypress");
var path = require("path");
var path_1 = require("path");
var vite_1 = require("vite");
var istanbul = require("vite-plugin-istanbul");
var BUILD_MODE_MAP;
(function (BUILD_MODE_MAP) {
    BUILD_MODE_MAP["development"] = "development";
    BUILD_MODE_MAP["production"] = "production";
    BUILD_MODE_MAP["ci"] = "ci";
    BUILD_MODE_MAP["test"] = "test";
})(BUILD_MODE_MAP || (BUILD_MODE_MAP = {}));
function cypressViteExecutor(options, context) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __awaiter(this, void 0, void 0, function () {
        var projectDir, projectRoot, cypressConfig, isViteDevServer, viteConfigFile, viteMode, vitePort, viteRoot, serverConfig, server, result;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    projectDir = context.workspace.projects[context.projectName].root;
                    projectRoot = devkit_1.joinPathFragments(context.root + "/" + projectDir);
                    cypressConfig = __assign(__assign({}, options.cypress), { project: path_1.dirname((_a = options.cypress) === null || _a === void 0 ? void 0 : _a.configFile), configFile: path_1.basename(options.cypress.configFile) });
                    isViteDevServer = (_b = options.vite) === null || _b === void 0 ? void 0 : _b.devServer;
                    viteConfigFile = (_c = options.vite) === null || _c === void 0 ? void 0 : _c.configFile;
                    viteMode = ((_d = options.vite) === null || _d === void 0 ? void 0 : _d.mode) && BUILD_MODE_MAP[(_e = options.vite) === null || _e === void 0 ? void 0 : _e.mode]
                        ? (_f = options.vite) === null || _f === void 0 ? void 0 : _f.mode : 'development';
                    vitePort = ((_g = options.vite) === null || _g === void 0 ? void 0 : _g.port) || 4200;
                    viteRoot = ((_h = options.vite) === null || _h === void 0 ? void 0 : _h.root) || './';
                    serverConfig = {
                        configFile: viteConfigFile,
                        mode: viteMode,
                        root: viteRoot,
                        server: {
                            port: vitePort
                        },
                        preview: {
                            port: vitePort
                        },
                        plugins: [
                            istanbul({
                                cwd: path.resolve.apply(path, __spreadArrays([context.root], viteRoot.split('/'))),
                                include: ['**/*.js', '**/*.ts'],
                                extension: ['.js', '.ts'],
                                exclude: ['**/*.spec.js', '**/*.spec.ts'],
                                cypress: true,
                                requireEnv: false
                            }),
                        ]
                    };
                    server = new ViteServer(serverConfig, isViteDevServer);
                    return [4 /*yield*/, server.createServer()];
                case 1:
                    _m.sent();
                    server.getServer().printUrls();
                    return [4 /*yield*/, (((_j = options.cypress) === null || _j === void 0 ? void 0 : _j.watch) ? cypress.open(cypressConfig)
                            : cypress.run(cypressConfig))];
                case 2:
                    result = _m.sent();
                    return [4 /*yield*/, server.close()];
                case 3:
                    _m.sent();
                    return [2 /*return*/, {
                            success: !((_k = result) === null || _k === void 0 ? void 0 : _k.totalFailed) &&
                                !((_l = result) === null || _l === void 0 ? void 0 : _l.failures)
                        }];
            }
        });
    });
}
exports["default"] = cypressViteExecutor;
var ViteServer = /** @class */ (function () {
    function ViteServer(config, isDevServer) {
        if (config === void 0) { config = {}; }
        if (isDevServer === void 0) { isDevServer = false; }
        this.isDevServer = false;
        this.server = undefined;
        this.config = config;
        this.isDevServer = isDevServer;
    }
    ViteServer.prototype.createServer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this.isDevServer) return [3 /*break*/, 3];
                        _a = this;
                        return [4 /*yield*/, vite_1.createServer(this.config)];
                    case 1:
                        _a.server = _c.sent();
                        return [4 /*yield*/, this.server.listen()];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, vite_1.build({
                            configFile: this.config.configFile,
                            mode: this.config.mode,
                            root: this.config.root
                        })];
                    case 4:
                        _c.sent();
                        _b = this;
                        return [4 /*yield*/, vite_1.preview(this.config)];
                    case 5:
                        _b.server = _c.sent();
                        _c.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ViteServer.prototype.getServer = function () {
        if (!this.server) {
            throw new Error('Server is not set');
        }
        return this.server;
    };
    ViteServer.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isDevServer) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getServer().close()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.getServer().httpServer.close()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return ViteServer;
}());
