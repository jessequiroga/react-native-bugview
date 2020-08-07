import * as React from "react";
import ScreenLogger from "./ScreenLogger";
import fs from "react-native-fs";
import { Alert, View, Text, Platform } from "react-native";
import { setJSExceptionHandler, setNativeExceptionHandler } from "react-native-exception-handler";
import moment from "moment";
import Device, { TDeviceInfo } from "./Device";
import NetworkLogger from "./NetworkLogger";
import BugViewContext from "./BugViewContext";
import { TError } from "./types";

type Props = {
    appVersion?: string,
    onCrashReport: (uri: string) => Promise<void>,
    onSaveReport?: () => void,
    renderErrorScreen?: (props: { error: TError, savingReport: boolean, restartApp: () => void }) => React.ReactNode,
    disableRecordScreen?: boolean,
    devMode?: boolean,
    recordTime?: number,
}

type State = {
    error: TError | undefined,
    enabled: boolean,
    savingReport: boolean
}

type EventType = 'image' | 'request' | 'response' | 'touch' | 'navigate';

type Event = {
    time: number,
    type: EventType,
    data: any
}



type Log = {
    date: string,
    bugviewVersion: string,
    deviceInfo: TDeviceInfo,
    timeline: Event[],
    error?: TError
}

const logFile = fs.DocumentDirectoryPath + `/log.json`;
const debugFile = fs.DocumentDirectoryPath + `/debug.json`;
const rate: number = Platform.select({ ios: 500, android: 700 })!

function format(date: Date, format: string = "DD.MM.YYYY") {
    return moment(date).format(format)
}

const bugviewVersion = "0.0.6";

const networkLogger = new NetworkLogger();

class BugView extends React.PureComponent<Props, State>{

    timeline: Event[] = []
    state: State = {
        error: undefined,
        enabled: false,
        savingReport: false
    }

    additionalParams: Record<string, any> = {}

    deviceInfo: TDeviceInfo = {};

    constructor(props: Props) {
        super(props);
        setJSExceptionHandler(this.jsErrorHandler, props.devMode);
        setNativeExceptionHandler(this.nativeErrorHandler, false, true);
    }

    componentDidMount() {
        const { onCrashReport } = this.props;
        if (!onCrashReport) return;
        this.setState({ enabled: true });
        this.initNetworkLogger();
        Device.getInfo().then(info => this.deviceInfo = info);
        fs
            .stat(logFile)
            .then(async file => {
                if (!file) return;
                this.sendLog();
            })
            .catch(console.warn);
    }

    initNetworkLogger = () => {
        networkLogger.setCallback(this.addEvent("response"));
        networkLogger.setStartRequestCallback(this.addEvent("request"));
        networkLogger.enableXHRInterception();
    }

    sendLog = async () => {
        const { onCrashReport } = this.props;
        if (!onCrashReport) return;

        try {
            await onCrashReport(logFile);
            fs.unlink(logFile)
        } catch (e) {

        }
    }

    getTimeline = async () => {
        return await Promise.all<any>(this.timeline.map(e => {
            if (e.type === "image") {
                return fs
                    .readFile(e.data, { encoding: "base64" })
                    .then(file =>({...e, data: file}))
                    .catch(console.warn)
            }
            return Promise.resolve(e)
        }))
    }

    createLogFile = async () => {
        const timeline = await this.getTimeline()

        const log: Log = {
            ...this.additionalParams,
            date: format(new Date()),
            timeline,
            deviceInfo: this.deviceInfo,
            bugviewVersion,
        }

        await fs.writeFile(debugFile, JSON.stringify(log), { encoding: "utf8" })
        return debugFile
    }

    createReportFile = async (error: TError) => {
        const timeline = await this.getTimeline()

        const log: Log = {
            ...this.additionalParams,
            date: format(new Date()),
            timeline,
            deviceInfo: this.deviceInfo,
            bugviewVersion,
            error
        }

        await fs.writeFile(logFile, JSON.stringify(log), { encoding: "utf8" })
        return logFile
    }

    createReport = (error: TError) => {
        this.setState({ error, savingReport: true });
        this.createReportFile(error)
            .then(() => {
                this.setState({ savingReport: false });
                this.props.onSaveReport && this.props.onSaveReport()
            })
            .catch(console.warn)
    }

    nativeErrorHandler = async (error: string) => {
        this.createReport({
            type: "native",
            message: error
        })

    }

    jsErrorHandler = async (error: Error, isFatal: boolean) => {
        console.log(error)
        this.createReport({
            type: "js",
            name: error.name,
            message: error.message,
            stack: error.stack,
        })

    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo){
        this.createReport({
            type: "js",
            name: error.name,
            message: error.message,
            stack: error.stack,
        })
    }

    addEvent = (type: EventType) => (data: any) => {
        this.timeline = this.timeline
            .map(event => {
                if (event.type === "image" && event.time <= Date.now() - this.recordTime * 1000) {
                    fs.unlink(event.data);
                }
                return event;
            })
            .filter((event) => event.time >= Date.now() - this.recordTime * 1000);


        this.timeline.push({
            time: Date.now(),
            type,
            data
        })
    }

    //@ts-ignore
    trackTouches = (eventType: "start" | "move" | "end") => (e: GestureResponderEvent) => {
        const touchEvent = {
            pageX: e.nativeEvent.pageX,
            pageY: e.nativeEvent.pageY,
            eventType
        }
        this.addEvent("touch")(touchEvent)
    }

    get recordTime() {
        return this.props.recordTime || 15
    }

    render() {
        const { renderErrorScreen, disableRecordScreen } = this.props;
        const { error, enabled, savingReport } = this.state;
        if (error && renderErrorScreen) {
            return renderErrorScreen({
                error,
                savingReport,
                restartApp: () => {
                    this.sendLog();
                    this.setState({ error: undefined });
                }
            })
        }

        let touchEvents = {}

        if (!disableRecordScreen) {
            touchEvents = {
                onTouchStart: this.trackTouches("start"),
                onTouchMove: this.trackTouches("move"),
                onTouchEnd: this.trackTouches("end")
            }
        }

        return <BugViewContext.Provider
            value={{
                addParam: (opt)=>{ this.additionalParams = {...this.additionalParams, ...opt}},
                navigationEvent: (screen, params)=>{
                    this.addEvent("navigate")({
                        screen,
                        params
                    })
                },
                createLogFile: this.createLogFile,
                bugviewVersion
            }}
        >
            {
                !disableRecordScreen &&
                enabled &&
                <ScreenLogger
                    onCapture={this.addEvent("image")}
                    rate={rate}
                ></ScreenLogger>
            }
            <View
                style={{ flex: 1 }}
                {...touchEvents}
            >
                {this.props.children}
            </View>
        </BugViewContext.Provider>

    }
}

export default BugView;