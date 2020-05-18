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
import * as React from "react";
import { captureScreen } from 'react-native-view-shot';
import { InteractionManager } from "react-native";
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
            InteractionManager.runAfterInteractions(function () {
                console.log("next");
                captureScreen({
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
export default ScreenLogger;
