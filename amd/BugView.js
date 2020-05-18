var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
define(["require", "exports", "react", "./ScreenLogger", "react-native-fs", "react-native", "react-native-exception-handler", "moment", "react-native-smtp-mailer", "./Device"], function (require, exports, React, ScreenLogger_1, react_native_fs_1, react_native_1, react_native_exception_handler_1, moment_1, react_native_smtp_mailer_1, Device_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    React = __importStar(React);
    ScreenLogger_1 = __importDefault(ScreenLogger_1);
    react_native_fs_1 = __importDefault(react_native_fs_1);
    moment_1 = __importDefault(moment_1);
    react_native_smtp_mailer_1 = __importDefault(react_native_smtp_mailer_1);
    Device_1 = __importDefault(Device_1);
    var logFile = react_native_fs_1.default.DocumentDirectoryPath + "/log.json";
    var rate = react_native_1.Platform.select({ ios: 500, android: 700 });
    function format(date, format) {
        if (format === void 0) { format = "DD.MM.YYYY"; }
        return moment_1.default(date).format(format);
    }
    var bugviewVersion = "0.0.1";
    var BugView = /** @class */ (function (_super) {
        __extends(BugView, _super);
        function BugView(props) {
            var _this = _super.call(this, props) || this;
            _this.timeline = [];
            _this.state = {
                error: undefined,
                enabled: false
            };
            _this.deviceInfo = {};
            _this.errorHandler = function (error, isFatal) { return __awaiter(_this, void 0, void 0, function () {
                var timeline, log;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!isFatal)
                                return [2 /*return*/];
                            this.setState({ error: error });
                            return [4 /*yield*/, Promise.all(this.timeline.map(function (e) {
                                    if (e.type === "image") {
                                        return react_native_fs_1.default
                                            .readFile(e.data, { encoding: "base64" })
                                            .then(function (file) { e.data = file; return e; })
                                            .catch(console.warn);
                                    }
                                    return Promise.resolve(e);
                                }))];
                        case 1:
                            timeline = _a.sent();
                            console.log(timeline);
                            log = {
                                date: format(new Date()),
                                timeline: timeline,
                                deviceInfo: this.deviceInfo,
                                bugviewVersion: bugviewVersion,
                                error: {
                                    name: error.name,
                                    message: error.message,
                                    stack: error.stack
                                }
                            };
                            react_native_fs_1.default
                                .writeFile(logFile, JSON.stringify(log), { encoding: "utf8" })
                                .then(console.log)
                                .catch(console.warn);
                            return [2 /*return*/];
                    }
                });
            }); };
            _this.addEvent = function (type) { return function (data) {
                _this.timeline = _this.timeline
                    .map(function (event) {
                    if (event.type === "image" && event.time <= Date.now() - 10 * 1000) {
                        react_native_fs_1.default.unlink(event.data);
                    }
                    return event;
                })
                    .filter(function (event) { return event.time >= Date.now() - 10 * 1000; });
                _this.timeline.push({
                    time: Date.now(),
                    type: type,
                    data: data
                });
            }; };
            //@ts-ignore
            _this.trackTouches = function (eventType) { return function (e) {
                var touchEvent = {
                    pageX: e.nativeEvent.pageX,
                    pageY: e.nativeEvent.pageY,
                    eventType: eventType
                };
                _this.addEvent("touch")(touchEvent);
            }; };
            react_native_exception_handler_1.setJSExceptionHandler(_this.errorHandler, true);
            return _this;
        }
        BugView.prototype.componentDidMount = function () {
            var _this = this;
            var _a = this.props, mailerSetup = _a.mailerSetup, onCrashReport = _a.onCrashReport;
            if (!mailerSetup && !onCrashReport)
                return;
            this.setState({ enabled: true });
            Device_1.default.getInfo().then(function (info) { return _this.deviceInfo = info; });
            react_native_fs_1.default
                .stat(logFile)
                .then(function (file) { return __awaiter(_this, void 0, void 0, function () {
                var wasSent, e_1, key, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!file)
                                return [2 /*return*/];
                            wasSent = false;
                            if (!mailerSetup) return [3 /*break*/, 4];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, react_native_smtp_mailer_1.default.sendMail(__assign(__assign({ port: "465", ssl: true }, mailerSetup), { attachmentPaths: [
                                        logFile
                                    ], attachmentNames: [
                                        "log.json",
                                    ], attachmentTypes: ["json"] //needed for android, in ios-only application, leave it empty: attachmentTypes:[]. Generally every img(either jpg, png, jpeg or whatever) file should have "img", and every other file should have its corresponding type.
                                 }))];
                        case 2:
                            _a.sent();
                            wasSent = true;
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            for (key in e_1) {
                                console.warn(key, e_1[key]);
                            }
                            return [3 /*break*/, 4];
                        case 4:
                            if (!onCrashReport) return [3 /*break*/, 8];
                            _a.label = 5;
                        case 5:
                            _a.trys.push([5, 7, , 8]);
                            return [4 /*yield*/, onCrashReport(logFile)];
                        case 6:
                            _a.sent();
                            wasSent = true;
                            return [3 /*break*/, 8];
                        case 7:
                            e_2 = _a.sent();
                            return [3 /*break*/, 8];
                        case 8:
                            if (wasSent) {
                                react_native_fs_1.default.unlink(logFile);
                            }
                            return [2 /*return*/];
                    }
                });
            }); })
                .catch(console.warn);
        };
        BugView.prototype.render = function () {
            var renderErrorScreen = this.props.renderErrorScreen;
            var _a = this.state, error = _a.error, enabled = _a.enabled;
            if (error && renderErrorScreen) {
                return renderErrorScreen(error);
            }
            return React.createElement(React.Fragment, null,
                enabled &&
                    React.createElement(ScreenLogger_1.default, { onCapture: this.addEvent("image"), rate: rate }),
                React.createElement(react_native_1.View, { style: { flex: 1 }, onTouchStart: this.trackTouches("start"), onTouchMove: this.trackTouches("move"), onTouchEnd: this.trackTouches("end") }, this.props.children));
        };
        return BugView;
    }(React.PureComponent));
    exports.default = BugView;
});