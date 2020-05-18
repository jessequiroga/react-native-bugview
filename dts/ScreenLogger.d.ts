import * as React from "react";
import ViewShot from 'react-native-view-shot';
declare type Props = {
    rate: number;
    onCapture: (result: string) => void;
};
export default class ScreenLogger extends React.PureComponent<Props> {
    timer?: number;
    viewShot?: ViewShot;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): null;
}
export {};
