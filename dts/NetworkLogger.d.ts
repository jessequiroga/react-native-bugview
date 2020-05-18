declare class NetworkRequestInfo {
    type: string;
    url: string;
    method: string;
    status: string;
    dataSent: string;
    responseContentType: string;
    responseSize: number;
    requestHeaders: Record<string, string> | undefined;
    responseHeaders: undefined;
    response: string;
    responseURL: string;
    responseType: string;
    timeout: number;
    closeReason: string;
    messages: string;
    serverClose: undefined;
    serverError: undefined;
    constructor(type: string, method: string, url: string);
}
export declare const LOGGER_FILENAME = "network_monitor_logger.txt";
declare type Callback = (e: NetworkRequestInfo[]) => void;
export default class NetworkLogger {
    _requests: NetworkRequestInfo[];
    _xhrIdMap: Record<number, number>;
    callback: Callback;
    setCallback(callback: () => void): void;
    _getRequestIndexByXHRID(index?: number): number;
    enableXHRInterception(): void;
    getRequests(): NetworkRequestInfo[];
}
export {};
