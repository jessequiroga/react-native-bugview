import * as React from "react";
import { TDeviceInfo } from "./Device";
declare type Props = {
    appVersion?: string;
    mailerSetup?: {
        mailhost: string;
        port?: string;
        username: string;
        password: string;
        from: string;
        recipients: string;
        subject: string;
        htmlBody: string;
    };
    onCrashReport?: (uri: string) => Promise<void>;
    renderErrorScreen?: (e: Error) => React.ReactNode;
};
declare type State = {
    error: Error | undefined;
    enabled: boolean;
};
declare type EventType = 'image' | 'request' | 'touch';
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
    sendLog: () => Promise<void>;
    errorHandler: (error: Error, isFatal: boolean) => Promise<void>;
    addEvent: (type: EventType) => (data: any) => void;
    trackTouches: (eventType: "start" | "move" | "end") => (e: any) => void;
    render(): {} | null | undefined;
}
export default BugView;
