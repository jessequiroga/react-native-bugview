import * as React from "react";
import ViewShot, { captureScreen } from 'react-native-view-shot';
import { InteractionManager, Platform } from "react-native";

type Props = {
    rate: number,
    onCapture: (result: string) => void,
}

const format = "jpg";
const result = "tmpfile";

export default class ScreenLogger extends React.PureComponent<Props> {
    timer?: number;
    viewShot?: ViewShot;

    componentDidMount() {
        
        this.timer = setInterval(() => {
            InteractionManager.runAfterInteractions(() => {
                captureScreen({
                    format,
                    result,
                    quality: .1
                })
                    .then(image => {
                        this.props.onCapture(image);
                    })
                    .catch(console.warn)
            });
        }, this.props.rate)
    }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer)
    }


    render() {
        return null
    }
}