import * as React from "react";
import ScreenLogger from "./ScreenLogger";
import fs from "react-native-fs";
import { Alert, View, Text, Platform } from "react-native";
import { setJSExceptionHandler } from "react-native-exception-handler";
import moment from "moment";
import Device, { TDeviceInfo } from "./Device";
import NetworkLogger from "./NetworkLogger";

type Props = {
    appVersion?: string,
    onCrashReport?: (uri: string) => Promise<void>,
    renderErrorScreen?: (e: Error) => React.ReactNode,
    disableRecordScreen?: boolean,
    devMode?: boolean,
    recordTime?: number
}

type State = {
    error: Error | undefined,
    enabled: boolean
}

type EventType = 'image' | 'request' | 'touch';

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
    error: Error
}

const logFile = fs.DocumentDirectoryPath + `/log.json`;
const rate: number = Platform.select({ ios: 500, android: 700 })!

function format(date: Date, format: string = "DD.MM.YYYY") {
    return moment(date).format(format)
}

const bugviewVersion = "0.0.2";

const networkLogger = new NetworkLogger();

class BugView extends React.PureComponent<Props, State>{

    timeline: Event[] = []
    state: State = {
        error: undefined,
        enabled: false
    }
    deviceInfo: TDeviceInfo = {};

    constructor(props: Props) {
        super(props);
        setJSExceptionHandler(this.errorHandler, props.devMode)
    }

    componentDidMount() {
        const { onCrashReport } = this.props;
        if (!onCrashReport) return;
        this.setState({ enabled: true });
        this.initNetworkLogger();
        fs
            .stat(logFile)
            .then(async file => {
                if (!file) return;
                this.sendLog();
            })
            .catch(console.warn);
    }

    initNetworkLogger = () => {
        networkLogger.setCallback(this.addEvent("request"));
        networkLogger.setStartRequestCallback(this.addEvent("request"));
        networkLogger.enableXHRInterception();
    }

    sendLog = async () => {
        try{
            const { onCrashReport } = this.props;
            if (!onCrashReport) return;
    
            this.deviceInfo = await Device.getInfo()
            let wasSent = false
    
            if (onCrashReport) {
                try {
                    await onCrashReport(logFile);
                    wasSent = true
                } catch (e) {
    
                }
    
            }
    
            if (wasSent) {
                fs.unlink(logFile)
            }
        } catch(e){
            Alert.alert("err", e.message)
        }

    }


    errorHandler = async (error: Error, isFatal: boolean) => {
        this.setState({ error });

        const timeline = await Promise.all<any>(this.timeline.map(e => {
            if (e.type === "image") {
                return fs
                    .readFile(e.data, { encoding: "base64" })
                    .then(file => { e.data = file; return e })
                    .catch(console.warn)
            }
            return Promise.resolve(e)
        }))

        const log: Log = {
            date: format(new Date()),
            timeline,
            deviceInfo: this.deviceInfo,
            bugviewVersion,
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack
            }
        }

        fs
            .writeFile(logFile, JSON.stringify(log), { encoding: "utf8" })
            .then(() => { })
            .catch(console.warn)

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

    get recordTime(){
        return this.props.recordTime || 15
    }

    render() {
        const { renderErrorScreen, disableRecordScreen } = this.props;
        const { error, enabled } = this.state;
        if (error && renderErrorScreen) {
            return renderErrorScreen(error)
        }

        let touchEvents = {}

        if (!disableRecordScreen) {
            touchEvents = {
                onTouchStart: this.trackTouches("start"),
                onTouchMove: this.trackTouches("move"),
                onTouchEnd: this.trackTouches("end")
            }
        }

        return <React.Fragment>
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
        </React.Fragment>

    }
}

export default BugView;