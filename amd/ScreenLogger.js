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
define(["require", "exports", "react", "react-native-view-shot", "react-native"], function (require, exports, React, react_native_view_shot_1, react_native_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    React = __importStar(React);
    var format = "jpg";
    var result = "tmpfile";
    var ScreenLogger = /** @class */ (function (_super) {
        __extends(ScreenLogger, _super);
        function ScreenLogger() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ScreenLogger.prototype.componentDidMount = function () {
            var _this = this;
            this.timer = setInterval(function () {
                react_native_1.InteractionManager.runAfterInteractions(function () {
                    console.log("next");
                    react_native_view_shot_1.captureScreen({
                        format: format,
                        result: result,
                        quality: .1
                    })
                        .then(function (image) {
                        _this.props.onCapture(image);
                    })
                        .catch(console.warn);
                });
            }, this.props.rate);
        };
        ScreenLogger.prototype.componentWillUnmount = function () {
            this.timer && clearInterval(this.timer);
        };
        ScreenLogger.prototype.render = function () {
            return null;
        };
        return ScreenLogger;
    }(React.PureComponent));
    exports.default = ScreenLogger;
});
