"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var ScreenLogger_1 = __importDefault(require("./ScreenLogger"));
var react_native_fs_1 = __importDefault(require("react-native-fs"));
var react_native_1 = require("react-native");
var react_native_exception_handler_1 = require("react-native-exception-handler");
var moment_1 = __importDefault(require("moment"));
var Device_1 = __importDefault(require("./Device"));
var NetworkLogger_1 = __importDefault(require("./NetworkLogger"));
var logFile = react_native_fs_1.default.DocumentDirectoryPath + "/log.json";
var rate = react_native_1.Platform.select({ ios: 500, android: 700 });
function format(date, format) {
    if (format === void 0) { format = "DD.MM.YYYY"; }
    return moment_1.default(date).format(format);
}
var bugviewVersion = "0.0.2";
var networkLogger = new NetworkLogger_1.default();
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
        _this.initNetworkLogger = function () {
            networkLogger.setCallback(_this.addEvent("request"));
            networkLogger.setStartRequestCallback(_this.addEvent("response"));
            networkLogger.enableXHRInterception();
        };
        _this.sendLog = function () { return __awaiter(_this, void 0, void 0, function () {
            var onCrashReport, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onCrashReport = this.props.onCrashReport;
                        if (!onCrashReport)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, onCrashReport(logFile)];
                    case 2:
                        _a.sent();
                        react_native_fs_1.default.unlink(logFile);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        _this.errorHandler = function (error, isFatal) { return __awaiter(_this, void 0, void 0, function () {
            var timeline, log;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
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
                            .then(function () { })
                            .catch(console.warn);
                        return [2 /*return*/];
                }
            });
        }); };
        _this.addEvent = function (type) { return function (data) {
            _this.timeline = _this.timeline
                .map(function (event) {
                if (event.type === "image" && event.time <= Date.now() - _this.recordTime * 1000) {
                    react_native_fs_1.default.unlink(event.data);
                }
                return event;
            })
                .filter(function (event) { return event.time >= Date.now() - _this.recordTime * 1000; });
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
        react_native_exception_handler_1.setJSExceptionHandler(_this.errorHandler, props.devMode);
        return _this;
    }
    BugView.prototype.componentDidMount = function () {
        var _this = this;
        var onCrashReport = this.props.onCrashReport;
        if (!onCrashReport)
            return;
        this.setState({ enabled: true });
        this.initNetworkLogger();
        Device_1.default.getInfo().then(function (info) { return _this.deviceInfo = info; });
        react_native_fs_1.default
            .stat(logFile)
            .then(function (file) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!file)
                    return [2 /*return*/];
                this.sendLog();
                return [2 /*return*/];
            });
        }); })
            .catch(console.warn);
    };
    Object.defineProperty(BugView.prototype, "recordTime", {
        get: function () {
            return this.props.recordTime || 15;
        },
        enumerable: false,
        configurable: true
    });
    BugView.prototype.render = function () {
        var _a = this.props, renderErrorScreen = _a.renderErrorScreen, disableRecordScreen = _a.disableRecordScreen;
        var _b = this.state, error = _b.error, enabled = _b.enabled;
        if (error && renderErrorScreen) {
            return renderErrorScreen(error);
        }
        var touchEvents = {};
        if (!disableRecordScreen) {
            touchEvents = {
                onTouchStart: this.trackTouches("start"),
                onTouchMove: this.trackTouches("move"),
                onTouchEnd: this.trackTouches("end")
            };
        }
        return React.createElement(React.Fragment, null,
            !disableRecordScreen &&
                enabled &&
                React.createElement(ScreenLogger_1.default, { onCapture: this.addEvent("image"), rate: rate }),
            React.createElement(react_native_1.View, __assign({ style: { flex: 1 } }, touchEvents), this.props.children));
    };
    return BugView;
}(React.PureComponent));
exports.default = BugView;
