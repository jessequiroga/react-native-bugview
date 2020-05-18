//@ts-ignore
import XHRInterceptor from 'react-native/Libraries/Network/XHRInterceptor'
import RNFS from 'react-native-fs'
let nextXHRId = 0

class NetworkRequestInfo {
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

    constructor(type: string, method: string, url: string) {
        this.type = type
        this.method = method
        this.url = url
    }
}

export const LOGGER_FILENAME = 'network_monitor_logger.txt'

type Callback = (e: NetworkRequestInfo[]) => void

export default class NetworkLogger {
    _requests: NetworkRequestInfo[] = []
    _xhrIdMap: Record<number, number> = {}
    callback:Callback = () => {}

    setCallback(callback: ()=>void) {
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

            const _xhr = new NetworkRequestInfo('XMLHttpRequest', method, url)

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
            this._requests[xhrIndex].dataSent = data
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
                this.callback(this._requests)
            },
        )
        XHRInterceptor.enableInterception()
    }

    getRequests() {
        return this._requests
    }

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