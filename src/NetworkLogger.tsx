//@ts-ignore
import XHRInterceptor from 'react-native/Libraries/Network/XHRInterceptor'

let nextXHRId = 0

class NetworkRequestInfo {
    id = 0
    type = ''
    url = ''
    method = ''
    status = ''
    dataSent = ''
    responseContentType = ''
    responseSize = 0
    requestHeaders: Record<string, string> | undefined = undefined
    responseHeaders = undefined
    response = ''
    responseURL = ''
    responseType = ''
    timeout = 0
    closeReason = ''
    messages = ''
    serverClose = undefined
    serverError = undefined

    constructor(id: number, type: string, method: string, url: string) {
        this.id = id
        this.type = type
        this.method = method
        this.url = url
    }
}


type Callback = (e: NetworkRequestInfo) => void

export default class NetworkLogger {
    _requests: NetworkRequestInfo[] = []
    _xhrIdMap: Record<number, number> = {}
    callback:Callback = () => {}
    startRequestCallback:Callback = () => {}

    setStartRequestCallback(callback: Callback) {
        this.startRequestCallback = callback
    }

    setCallback(callback: Callback) {
        this.callback = callback
    }

    _getRequestIndexByXHRID(index?: number) {
        if (index === undefined) {
            return -1
        }
        const xhrIndex = this._xhrIdMap[index]
        if (xhrIndex === undefined) {
            return -1
        } else {
            return xhrIndex
        }
    }

    enableXHRInterception() {
        if (XHRInterceptor.isInterceptorEnabled()) {
            return
        }
        XHRInterceptor.setOpenCallback((method: string, url: string, xhr: any) => {
            xhr._index = nextXHRId++
            const xhrIndex = this._requests.length
            this._xhrIdMap[xhr._index] = xhrIndex

            const _xhr = new NetworkRequestInfo(xhrIndex, 'XMLHttpRequest', method, url)

            this._requests.push(_xhr)
        })

        XHRInterceptor.setRequestHeaderCallback((header: any, value: any, xhr: any) => {
            const xhrIndex = this._getRequestIndexByXHRID(xhr._index)
            if (xhrIndex === -1) {
                return
            }
            const networkInfo = this._requests[xhrIndex]
            if (!networkInfo.requestHeaders) {
                networkInfo.requestHeaders = {}
            }
            networkInfo.requestHeaders[header] = value
        })

        XHRInterceptor.setSendCallback((data: any, xhr: any) => {
            const xhrIndex = this._getRequestIndexByXHRID(xhr._index)
            if (xhrIndex === -1) {
                return
            }
            this._requests[xhrIndex].dataSent = data;
            this.startRequestCallback && this.startRequestCallback({...this._requests[xhrIndex]})
        })

        XHRInterceptor.setHeaderReceivedCallback(
            (type: string, size: number, responseHeaders: any, xhr: any) => {
                const xhrIndex = this._getRequestIndexByXHRID(xhr._index)
                if (xhrIndex === -1) {
                    return
                }
                const networkInfo = this._requests[xhrIndex]
                networkInfo.responseContentType = type
                networkInfo.responseSize = size
                networkInfo.responseHeaders = responseHeaders
            },
        )

        XHRInterceptor.setResponseCallback(
            (status: string, timeout: any, response: any, responseURL: string, responseType: string, xhr: any) => {
                const xhrIndex = this._getRequestIndexByXHRID(xhr._index)
                if (xhrIndex === -1) {
                    return
                }
                const networkInfo = this._requests[xhrIndex]
                networkInfo.status = status
                networkInfo.timeout = timeout
                networkInfo.response = response
                networkInfo.responseURL = responseURL
                networkInfo.responseType = responseType
                this.callback && this.callback(networkInfo)
            },
        )
        XHRInterceptor.enableInterception()
    }

    getRequests() {
        return this._requests
    }


}