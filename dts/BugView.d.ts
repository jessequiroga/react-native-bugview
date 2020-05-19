import * as React from "react";
import { TDeviceInfo } from "./Device";
declare type Props = {
    appVersion?: string;
    onCrashReport?: (uri: string) => Promise<void>;
    onSaveReport?: () => void;
    renderErrorScreen?: (props: {
        error: Error;
        savingReport: boolean;
    }) => React.ReactNode;
    disableRecordScreen?: boolean;
    devMode?: boolean;
    recordTime?: number;
};
declare type State = {
    error: Error | undefined;
    enabled: boolean;
    savingReport: boolean;
};
declare type EventType = 'image' | 'request' | 'response' | 'touch';
declare type Event = {
    time: number;
    type: EventType;
    data: any;
};
declare class BugView extends React.PureComponent<Props, State> {
    timeline: Event[];
    state: State;
    deviceInfo: TDeviceInfo;
    constructor(props: Props);
    componentDidMount(): void;
    initNetworkLogger: () => void;
    sendLog: () => Promise<void>;
    errorHandler: (error: Error, isFatal: boolean) => Promise<void>;
    addEvent: (type: EventType) => (data: any) => void;
    trackTouches: (eventType: "start" | "move" | "end") => (e: any) => void;
    get recordTime(): number;
    render(): {} | null | undefined;
}
export default BugView;
