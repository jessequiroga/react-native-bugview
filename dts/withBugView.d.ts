import * as React from "react";
import { TBugVIewContext } from "./BugViewContext";
export declare type WithBugView = TBugVIewContext;
declare const withBugView: <T>(WrappedComponent: React.ComponentType<T & TBugVIewContext>) => React.ComponentType<T & TBugVIewContext>;
export default withBugView;
