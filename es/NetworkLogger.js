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
//@ts-ignore
import XHRInterceptor from 'react-native/Libraries/Network/XHRInterceptor';
var nextXHRId = 0;
var NetworkRequestInfo = /** @class */ (function () {
    function NetworkRequestInfo(id, type, method, url) {
        this.id = 0;
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
        this.id = id;
        this.type = type;
        this.method = method;
        this.url = url;
    }
    return NetworkRequestInfo;
}());
var NetworkLogger = /** @class */ (function () {
    function NetworkLogger() {
        this._requests = [];
        this._xhrIdMap = {};
        this.callback = function () { };
        this.startRequestCallback = function () { };
    }
    NetworkLogger.prototype.setStartRequestCallback = function (callback) {
        this.startRequestCallback = callback;
    };
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
        if (XHRInterceptor.isInterceptorEnabled()) {
            return;
        }
        XHRInterceptor.setOpenCallback(function (method, url, xhr) {
            xhr._index = nextXHRId++;
            var xhrIndex = _this._requests.length;
            _this._xhrIdMap[xhr._index] = xhrIndex;
            var _xhr = new NetworkRequestInfo(xhrIndex, 'XMLHttpRequest', method, url);
            _this._requests.push(_xhr);
        });
        XHRInterceptor.setRequestHeaderCallback(function (header, value, xhr) {
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
        XHRInterceptor.setSendCallback(function (data, xhr) {
            var xhrIndex = _this._getRequestIndexByXHRID(xhr._index);
            if (xhrIndex === -1) {
                return;
            }
            _this._requests[xhrIndex].dataSent = data;
            _this.startRequestCallback && _this.startRequestCallback(__assign({}, _this._requests[xhrIndex]));
        });
        XHRInterceptor.setHeaderReceivedCallback(function (type, size, responseHeaders, xhr) {
            var xhrIndex = _this._getRequestIndexByXHRID(xhr._index);
            if (xhrIndex === -1) {
                return;
            }
            var networkInfo = _this._requests[xhrIndex];
            networkInfo.responseContentType = type;
            networkInfo.responseSize = size;
            networkInfo.responseHeaders = responseHeaders;
        });
        XHRInterceptor.setResponseCallback(function (status, timeout, response, responseURL, responseType, xhr) {
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
            _this.callback && _this.callback(networkInfo);
        });
        XHRInterceptor.enableInterception();
    };
    NetworkLogger.prototype.getRequests = function () {
        return this._requests;
    };
    return NetworkLogger;
}());
export default NetworkLogger;
