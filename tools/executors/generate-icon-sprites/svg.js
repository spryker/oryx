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
var fs_1 = require("fs");
var path_1 = require("path");
var typescript_1 = require("typescript");
// @ts-ignore
var tsconfig_base_json_1 = require("../../../tsconfig.base.json");
var utils_1 = require("../../utils");
var compiler_1 = require("./compiler");
function echoExecutor(options, context) {
    return __awaiter(this, void 0, void 0, function () {
        var cwd, outDir, iconSets, i, entry, input, output, compiled, isEmitted, unsortedIcons, icons, svgTemplate, aliasTemplate, spriteTemplate, templates, i_1, icon;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cwd = context.workspace.projects[context.projectName].root;
                    outDir = 'dist-sprites';
                    iconSets = options.iconSets;
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < iconSets.length)) return [3 /*break*/, 4];
                    entry = iconSets[i];
                    input = (0, path_1.resolve)(cwd, entry.input);
                    output = (0, path_1.resolve)(cwd, entry.output);
                    compiled = (0, path_1.resolve)(outDir, cwd, entry.input.replace('.ts', '.js'));
                    isEmitted = (0, compiler_1.compile)(input, __assign({ target: typescript_1.ScriptTarget.ES2020, module: typescript_1.ModuleKind.CommonJS, skipLibCheck: true, outDir: outDir, rootDir: '.', experimentalDecorators: true }, tsconfig_base_json_1.compilerOptions));
                    if (!isEmitted) {
                        console.error("Error while compiling ".concat(input, " input"));
                        return [2 /*return*/, { success: false }];
                    }
                    return [4 /*yield*/, Promise.resolve().then(function () { return require(compiled); })];
                case 2:
                    unsortedIcons = _a.sent();
                    icons = (0, utils_1.sortObjectByKeys)(unsortedIcons);
                    svgTemplate = function (id, value) {
                        return "<symbol id=\"".concat(id, "\">").concat(value, "</symbol>");
                    };
                    aliasTemplate = function (id, alias) {
                        return "<symbol id=\"".concat(id, "\"><use href=\"#").concat(alias, "\"/></symbol>");
                    };
                    spriteTemplate = function (sprites) { return "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n      <svg version=\"1.1\"\n        xmlns=\"http://www.w3.org/2000/svg\"\n        xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n          ".concat(sprites.join('\n'), "\n      </svg>"); };
                    templates = [];
                    console.info("Converting icons to the correct structure");
                    for (i_1 in icons) {
                        icon = icons[i_1];
                        if (icon.alias) {
                            templates.push(aliasTemplate(icon.type, icon.alias));
                        }
                        else {
                            templates.push(svgTemplate(icon.type, icon.source.join('')));
                        }
                    }
                    if (!(0, fs_1.existsSync)((0, path_1.dirname)(output))) {
                        (0, fs_1.mkdirSync)((0, path_1.dirname)(output), { recursive: true });
                    }
                    console.info("Generating sprite for ".concat(input));
                    (0, fs_1.writeFileSync)(output, spriteTemplate(templates));
                    if ((0, fs_1.existsSync)(outDir)) {
                        (0, fs_1.rmdirSync)(outDir, { recursive: true });
                    }
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, { success: true }];
            }
        });
    });
}
exports["default"] = echoExecutor;
