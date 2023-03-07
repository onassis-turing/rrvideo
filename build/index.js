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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformToVideo = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var child_process_1 = require("child_process");
var puppeteer_1 = __importDefault(require("puppeteer"));
var rrwebScriptPath = path.resolve(require.resolve("rrweb-player"), "../../dist/index.js");
var rrwebStylePath = path.resolve(rrwebScriptPath, "../style.css");
var rrwebRaw = fs.readFileSync(rrwebScriptPath, "utf-8");
var rrwebStyle = fs.readFileSync(rrwebStylePath, "utf-8");
function getHtml(events, config) {
    return "\n<html>\n  <head>\n  <style>" + rrwebStyle + "</style>\n  </head>\n  <body>\n    <script>\n      " + rrwebRaw + ";\n      /*<!--*/\n      const events = " + JSON.stringify(events).replace(/<\/script>/g, "<\\/script>") + ";\n      /*-->*/\n      const userConfig = " + (config ? JSON.stringify(config) : {}) + ";\n      window.replayer = new rrwebPlayer({\n        target: document.body,\n        props: {\n          events,\n          showController: false,\n          ...userConfig\n        },\n      });\n      window.onReplayStart();\n      window.replayer.play();\n      window.replayer.addEventListener('finish', () => window.onReplayFinish());\n    </script>\n  </body>\n</html>\n";
}
var defaultConfig = {
    fps: 15,
    headless: true,
    input: "",
    cb: function () { },
    output: "rrvideo-output.mp4",
    rrwebPlayer: {},
};
var RRvideo = /** @class */ (function () {
    function RRvideo(config) {
        this.state = "idle";
        this.config = {
            fps: (config === null || config === void 0 ? void 0 : config.fps) || defaultConfig.fps,
            headless: (config === null || config === void 0 ? void 0 : config.headless) || defaultConfig.headless,
            input: (config === null || config === void 0 ? void 0 : config.input) || defaultConfig.input,
            cb: (config === null || config === void 0 ? void 0 : config.cb) || defaultConfig.cb,
            output: (config === null || config === void 0 ? void 0 : config.output) || defaultConfig.output,
            rrwebPlayer: (config === null || config === void 0 ? void 0 : config.rrwebPlayer) || defaultConfig.rrwebPlayer,
        };
    }
    RRvideo.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, eventsPath, events, error_1;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 8, , 9]);
                        _a = this;
                        return [4 /*yield*/, puppeteer_1.default.launch({
                                headless: this.config.headless,
                                args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox', '--shm-size=2gb']
                                /* DISABLE SANDBOX:
                                CHANGE USER DOESN'T WORKS 'Failed to move to new namespace:' */
                            })];
                    case 1:
                        _a.browser = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.browser.newPage()];
                    case 2:
                        _b.page = _c.sent();
                        /* DISABLE NAVIGATION TIME OUT    */
                        return [4 /*yield*/, this.page.setDefaultNavigationTimeout(0)];
                    case 3:
                        /* DISABLE NAVIGATION TIME OUT    */
                        _c.sent();
                        return [4 /*yield*/, this.page.goto("about:blank")];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, this.page.exposeFunction("onReplayStart", function () {
                                _this.startRecording();
                            })];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, this.page.exposeFunction("onReplayFinish", function () {
                                _this.finishRecording();
                            })];
                    case 6:
                        _c.sent();
                        eventsPath = path.isAbsolute(this.config.input)
                            ? this.config.input
                            : path.resolve(process.cwd(), this.config.input);
                        events = JSON.parse(fs.readFileSync(eventsPath, "utf-8"));
                        return [4 /*yield*/, this.page.setContent(getHtml(events, this.config.rrwebPlayer))];
                    case 7:
                        _c.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        error_1 = _c.sent();
                        this.config.cb("", error_1);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    RRvideo.prototype.startRecording = function () {
        return __awaiter(this, void 0, void 0, function () {
            var wrapperSelector, wrapperEl, args, ffmpegProcess, processError, timer, outputPath;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.state = "recording";
                        wrapperSelector = ".replayer-wrapper";
                        if (this.config.rrwebPlayer.width && this.config.rrwebPlayer.height) {
                            wrapperSelector = ".rr-player";
                        }
                        return [4 /*yield*/, this.page.$(wrapperSelector)];
                    case 1:
                        wrapperEl = _a.sent();
                        if (!wrapperEl) {
                            throw new Error("failed to get replayer element");
                        }
                        args = [
                            // fps
                            "-framerate",
                            this.config.fps.toString(),
                            // input
                            "-f",
                            "image2pipe",
                            "-i",
                            "-",
                            "-pix_fmt",
                            "yuv420p",
                            // output
                            "-an",
                            "-threads",
                            "4",
                            "-vcodec",
                            "libx264",
                            "-crf",
                            "27",
                            "-preset",
                            "ultrafast",
                            "-speed",
                            "8",
                            "-y",
                            this.config.output,
                        ];
                        ffmpegProcess = child_process_1.spawn("ffmpeg", args);
                        ffmpegProcess.stderr.setEncoding("utf-8");
                        ffmpegProcess.stderr.on("data", console.log);
                        processError = null;
                        timer = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                            var buffer, error_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(this.state === "recording" && !processError)) return [3 /*break*/, 5];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, wrapperEl.screenshot({
                                                encoding: "binary",
                                            })];
                                    case 2:
                                        buffer = _a.sent();
                                        ffmpegProcess.stdin.write(buffer);
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_2 = _a.sent();
                                        return [3 /*break*/, 4];
                                    case 4: return [3 /*break*/, 6];
                                    case 5:
                                        clearInterval(timer);
                                        if (this.state === "closed" && !processError) {
                                            ffmpegProcess.stdin.end();
                                        }
                                        _a.label = 6;
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); }, 1000 / this.config.fps);
                        outputPath = path.isAbsolute(this.config.output)
                            ? this.config.output
                            : path.resolve(process.cwd(), this.config.output);
                        ffmpegProcess.on("close", function () {
                            if (processError) {
                                return;
                            }
                            _this.config.cb(outputPath, null);
                        });
                        ffmpegProcess.on("error", function (error) {
                            if (processError) {
                                return;
                            }
                            processError = error;
                            _this.config.cb(outputPath, error);
                        });
                        ffmpegProcess.stdin.on("error", function (error) {
                            if (processError) {
                                return;
                            }
                            processError = error;
                            _this.config.cb(outputPath, error);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    RRvideo.prototype.finishRecording = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.state = "closed";
                        return [4 /*yield*/, this.browser.close()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return RRvideo;
}());
function transformToVideo(config) {
    return new Promise(function (resolve, reject) {
        var rrvideo = new RRvideo(__assign(__assign({}, config), { cb: function (file, error) {
                if (error) {
                    return reject(error);
                }
                resolve(file);
            } }));
        rrvideo.init();
    });
}
exports.transformToVideo = transformToVideo;
