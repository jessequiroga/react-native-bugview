import * as React from "react";
export declare type TBugVIewContext = {
    addParam: (opt: Record<string, any>) => void;
    navigationEvent: (screen: string, params?: any) => void;
    createLogFile: () => Promise<string>;
    bugviewVersion: string;
};
declare const _default: React.Context<TBugVIewContext>;
export default _default;
