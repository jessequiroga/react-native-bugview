declare type StaticDeviceInfo = {
    platform: "ios" | "android" | "windows" | "macos" | "web";
    systemVersion: string;
    nativeVersion: string;
    appVersion: string;
    releaseDate: string;
    apiLevel: number;
    appName: string;
    brand: string;
    buildNumber: string;
    bundleId: string;
    operator: string;
    deviceId: string;
    deviceLocale: string;
    isTablet: boolean;
    deviceCountry: string;
    ip: string;
    uniqueDeviceId: string;
    screenSize: {
        width: number;
        height: number;
    };
    pixelRatio: number;
};
declare type PromiseDeviceInfo = {
    battaryLevel: number;
    locationEnabled: boolean;
    freeDiskStorage: number;
};
export declare type TDeviceInfo = Partial<StaticDeviceInfo & PromiseDeviceInfo>;
declare class Device {
    static getStaticInfo(): Partial<StaticDeviceInfo>;
    static getInfo(): Promise<TDeviceInfo>;
}
export default Device;
