import * as React from "react";
import ScreenLogger from "./ScreenLogger";
import fs from "react-native-fs";
import { Alert, View, Text, Platform } from "react-native";
import { setJSExceptionHandler } from "react-native-exception-handler";
import moment from "moment";
//@ts-ignore
import RNSmtpMailer from "react-native-smtp-mailer";
import Device, { TDeviceInfo } from "./Device";

type Props = {
    appVersion?: string,
    mailerSetup?: {
        mailhost: string,
        port?: string,
        username: string,
        password: string,
        from: string,
        recipients: string,
        subject: string,
        htmlBody: string,
    },
    onCrashReport?: (uri: string) => Promise<void>,
    renderErrorScreen?: (e: Error) => React.ReactNode
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

const bugviewVersion = "0.0.1";

class BugView extends React.PureComponent<Props, State>{

    timeline: Event[] = []
    state: State = {
        error: undefined,
        enabled: false
    }
    deviceInfo: TDeviceInfo = {};

    constructor(props: Props) {
        super(props);
        setJSExceptionHandler(this.errorHandler, true)
    }

    componentDidMount() {
        const { mailerSetup, onCrashReport } = this.props;
        if (!mailerSetup && !onCrashReport) return;
        this.setState({ enabled: true })
        Device.getInfo().then(info => this.deviceInfo = info);
        fs
            .stat(logFile)
            .then(async file => {
                if (!file) return;


                let wasSent = false

                if (mailerSetup) {
                    try {
                        await RNSmtpMailer.sendMail({
                            port: "465",
                            ssl: true, //if ssl: false, TLS is enabled,**note:** in iOS TLS/SSL is determined automatically, so either true or false is the same
                            ...mailerSetup,
                            attachmentPaths: [
                                logFile
                            ],
                            attachmentNames: [
                                "log.json",
                            ], //only used in android, these are renames of original files. in ios filenames will be same as specified in path. In ios-only application, leave it empty: attachmentNames:[]
                            attachmentTypes: ["json"] //needed for android, in ios-only application, leave it empty: attachmentTypes:[]. Generally every img(either jpg, png, jpeg or whatever) file should have "img", and every other file should have its corresponding type.
                        })
                        wasSent = true
                    } catch (e) {
                        for (let key in e) {
                            console.warn(key, e[key])
                        }
                    }

                }

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


            })
            .catch(console.warn);
    }


    errorHandler = async (error: Error, isFatal: boolean) => {
        if (!isFatal) return;
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

        console.log(timeline);

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
            .then(console.log)
            .catch(console.warn)

    }

    addEvent = (type: EventType) => (data: any) => {
        this.timeline = this.timeline
            .map(event => {
                if (event.type === "image" && event.time <= Date.now() - 10 * 1000) {
                    fs.unlink(event.data);
                }
                return event;
            })
            .filter((event) => event.time >= Date.now() - 10 * 1000);


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


    render() {
        const { renderErrorScreen } = this.props;
        const { error, enabled } = this.state;
        if (error && renderErrorScreen) {
            return renderErrorScreen(error)
        }
        return <React.Fragment>
            {
                enabled &&
                <ScreenLogger
                    onCapture={this.addEvent("image")}
                    rate={rate}
                ></ScreenLogger>
            }
            <View
                style={{ flex: 1 }}
                onTouchStart={this.trackTouches("start")}
                onTouchMove={this.trackTouches("move")}
                onTouchEnd={this.trackTouches("end")}
            >
                {this.props.children}
            </View>
        </React.Fragment>

    }
}

export default BugView;