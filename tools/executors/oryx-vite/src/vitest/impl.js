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
var run_commands_impl_1 = require("nx/src/executors/run-commands/run-commands.impl");
function vitestExecutor(options, context) {
    var _a, _b;
    var _c, _d;
    return __awaiter(this, void 0, void 0, function () {
        var projectDir, projectRoot, path, startVitest;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    projectDir = context.workspace.projects[context.projectName].root;
                    projectRoot = (0, devkit_1.joinPathFragments)(context.root, projectDir);
                    if (!!options.typechekingOff) return [3 /*break*/, 2];
                    path = options.tsconfigPath ? "-p ".concat(options.tsconfigPath) : '';
                    return [4 /*yield*/, (0, run_commands_impl_1.default)({
                            command: "npx tsc ".concat(path),
                            cwd: projectRoot,
                            // TODO: check this
                            __unparsed__: [''],
                        }, context)];
                case 1:
                    _f.sent();
                    _f.label = 2;
                case 2:
                    if (options.watch) {
                        delete options.coverage;
                    }
                    else {
                        // list of files that should be included
                        // by default
                        (_a = (_c = options.coverage).include) !== null && _a !== void 0 ? _a : (_c.include = ["".concat(projectDir, "/**/*.ts")]);
                        (_b = (_d = options.coverage).exclude) !== null && _b !== void 0 ? _b : (_d.exclude = []);
                        // list of files that should be excluded
                        // as coverage is not important for them
                        (_e = options.coverage.exclude).push.apply(_e, [
                            '**/vitest.config.ts',
                            '**/index.ts',
                            '**/.constants.ts',
                            '**/*.spec.ts',
                            '**/*mock*.ts',
                            '**/*.stories.ts',
                            '**/stories/*.*',
                            '**/stories/**/*.*',
                            '**/*.schema.ts',
                            '**/*.styles.ts',
                            '**/*.def.ts',
                            '**/*.model.ts',
                            '**/mocks/**/*',
                            '**/*.mixin.ts',
                            '**/constants.ts',
                            '**/feature.ts',
                        ]);
                        // Don't remove this log, it is used in Unit Tests coverage reports analysis
                        // We should be able to see which files are included in the analysis to not miss something
                        console.log('Unit tests run config: ', options);
                    }
                    return [4 /*yield*/, Function("return import ('vitest/node')")()];
                case 3:
                    startVitest = (_f.sent()).startVitest;
                    return [4 /*yield*/, startVitest('test', [], __assign(__assign({}, options), { root: projectRoot }))];
                case 4:
                    _f.sent();
                    if (!options.watch) {
                        return [2 /*return*/, { success: !process.exitCode }];
                    }
                    return [2 /*return*/, new Promise(function () { })];
            }
        });
    });
}
exports.default = vitestExecutor;
