var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "react-native/Libraries/Network/XHRInterceptor"], function (require, exports, XHRInterceptor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LOGGER_FILENAME = void 0;
    XHRInterceptor_1 = __importDefault(XHRInterceptor_1);
    var nextXHRId = 0;
    var NetworkRequestInfo = /** @class */ (function () {
        function NetworkRequestInfo(type, method, url) {
            this.type = '';
            this.url = '';
            this.method = '';
            this.status = '';
            this.dataSent = '';
            this.responseContentType = '';
            this.responseSize = 0;
            this.requestHeaders = undefined;
            this.responseHeaders = undefined;
            this.response = '';
            this.responseURL = '';
            this.responseType = '';
            this.timeout = 0;
            this.closeReason = '';
            this.messages = '';
            this.serverClose = undefined;
            this.serverError = undefined;
            this.type = type;
            this.method = method;
            this.url = url;
        }
        return NetworkRequestInfo;
    }());
    exports.LOGGER_FILENAME = 'network_monitor_logger.txt';
    var NetworkLogger = /** @class */ (function () {
        function NetworkLogger() {
            this._requests = [];
            this._xhrIdMap = {};
            this.callback = function () { };
            // sendFeedbackEmail(email, password, subject, message) {
            //     this.saveNetworkLogger(LOGGER_FILENAME)
            //         .then(response =>
            //             this.sendMail(
            //                 LOGGER_FILENAME,
            //                 email,
            //                 password,
            //                 subject,
            //                 message,
            //             ),
            //         )
            //         .then(response => this.deleteNetworkLogger(LOGGER_FILENAME))
            //         .then(response => console.log('SUCCESS'))
            //         .catch(error => console.log(error))
            // }
            // sendMail(filename, email, password, subject, message) {
            //     console.log('logger.sendFeedbackEmail')
            //     return RNSmtpMailer.sendMail({
            //         mailhost: 'smtp.gmail.com',
            //         port: '465',
            //         ssl: true,
            //         username: email,
            //         from: email,
            //         password: password,
            //         recipients: email,
            //         subject: subject,
            //         htmlBody: message,
            //         attachmentPaths: [this.getPath(filename)],
            //         attachmentNames: [filename],
            //         attachmentTypes: ['txt'],
            //     })
            // }
            // saveNetworkLogger(filename: string) {
            //     console.log('logger.saveNetworkLogger')
            //     return RNFS.writeFile(
            //         this.getPath(filename),
            //         JSON.stringify(this.getRequests()),
            //         'utf8',
            //     )
            // }
            // deleteNetworkLogger(filename: string) {
            //     console.log('logger.deleteNetworkLogger')
            //     return RNFS.unlink(this.getPath(filename))
            // }
            // getPath(filename: string) {
            //     return RNFS.DocumentDirectoryPath + '/' + filename
            // }
        }
        NetworkLogger.prototype.setCallback = function (callback) {
            this.callback = callback;
        };
        NetworkLogger.prototype._getRequestIndexByXHRID = function (index) {
            if (index === undefined) {
                return -1;
            }
            var xhrIndex = this._xhrIdMap[index];
            if (xhrIndex === undefined) {
                return -1;
            }
            else {
                return xhrIndex;
            }
        };
        NetworkLogger.prototype.enableXHRInterception = function () {
            var _this = this;
            if (XHRInterceptor_1.default.isInterceptorEnabled()) {
                return;
            }
            XHRInterceptor_1.default.setOpenCallback(function (method, url, xhr) {
                xhr._index = nextXHRId++;
                var xhrIndex = _this._requests.length;
                _this._xhrIdMap[xhr._index] = xhrIndex;
                var _xhr = new NetworkRequestInfo('XMLHttpRequest', method, url);
                _this._requests.push(_xhr);
            });
            XHRInterceptor_1.default.setRequestHeaderCallback(function (header, value, xhr) {
                var xhrIndex = _this._getRequestIndexByXHRID(xhr._index);
                if (xhrIndex === -1) {
                    return;
                }
                var networkInfo = _this._requests[xhrIndex];
                if (!networkInfo.requestHeaders) {
                    networkInfo.requestHeaders = {};
                }
                networkInfo.requestHeaders[header] = value;
            });
            XHRInterceptor_1.default.setSendCallback(function (data, xhr) {
                var xhrIndex = _this._getRequestIndexByXHRID(xhr._index);
                if (xhrIndex === -1) {
                    return;
                }
                _this._requests[xhrIndex].dataSent = data;
            });
            XHRInterceptor_1.default.setHeaderReceivedCallback(function (type, size, responseHeaders, xhr) {
                var xhrIndex = _this._getRequestIndexByXHRID(xhr._index);
                if (xhrIndex === -1) {
                    return;
                }
                var networkInfo = _this._requests[xhrIndex];
                networkInfo.responseContentType = type;
                networkInfo.responseSize = size;
                networkInfo.responseHeaders = responseHeaders;
            });
            XHRInterceptor_1.default.setResponseCallback(function (status, timeout, response, responseURL, responseType, xhr) {
                var xhrIndex = _this._getRequestIndexByXHRID(xhr._index);
                if (xhrIndex === -1) {
                    return;
                }
                var networkInfo = _this._requests[xhrIndex];
                networkInfo.status = status;
                networkInfo.timeout = timeout;
                networkInfo.response = response;
                networkInfo.responseURL = responseURL;
                networkInfo.responseType = responseType;
                _this.callback(_this._requests);
            });
            XHRInterceptor_1.default.enableInterception();
        };
        NetworkLogger.prototype.getRequests = function () {
            return this._requests;
        };
        return NetworkLogger;
    }());
    exports.default = NetworkLogger;
});