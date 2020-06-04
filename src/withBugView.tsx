import * as React from "react";
import hoistNonReactStatics from "hoist-non-react-statics";
import BugViewContext, { TBugVIewContext } from "./BugViewContext";

export declare type WithBugView = TBugVIewContext

const withBugView = function <T>(WrappedComponent: React.ComponentType<T & WithBugView>): React.ComponentType<T & WithBugView> {
    class Wrapper extends React.PureComponent<T & WithBugView, {}>{

        render() {
            return (
                <BugViewContext.Consumer>
                    {
                        (props) => (
                            <WrappedComponent
                                {...this.props}
                                {...props}
                            />
                        )
                    }
                </BugViewContext.Consumer>

            )
        }
    }

    return hoistNonReactStatics(Wrapper, WrappedComponent as any);
}
export default withBugView