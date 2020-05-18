import DeviceInfo from 'react-native-device-info';
import { Platform, Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get("screen");

type StaticDeviceInfo = {
    platform: "ios" | "android" | "windows" | "macos" | "web",
    systemVersion: string,
    nativeVersion: string,
    appVersion: string,
    releaseDate: string,
    apiLevel: number,
    appName:string,
    brand: string,
    buildNumber: string,
    bundleId: string,
    operator: string,
    deviceId: string,
    deviceLocale: string,
    isTablet: boolean,
    deviceCountry: string,
    ip: string,
    uniqueDeviceId: string,
    screenSize: {width: number, height: number},
    pixelRatio: number
}

type PromiseDeviceInfo = {
    battaryLevel: number,
    locationEnabled: boolean,
    freeDiskStorage: number
}

export type TDeviceInfo = Partial<StaticDeviceInfo & PromiseDeviceInfo>;

let staticInfo: Partial<StaticDeviceInfo> = {}

class Device {
    static getStaticInfo(){
        try{
            staticInfo = {
                screenSize: {width, height},
                platform: Platform.OS,
                systemVersion: DeviceInfo.getSystemVersion(),
                nativeVersion: DeviceInfo.getVersion(),
                apiLevel: DeviceInfo.getApiLevelSync(),
                appName: DeviceInfo.getApplicationName(),
                brand: DeviceInfo.getBrand(),
                buildNumber: DeviceInfo.getBuildNumber(),
                bundleId: DeviceInfo.getBundleId(),
                operator: DeviceInfo.getCarrierSync(),
                deviceId: DeviceInfo.getDeviceId(),
                isTablet: DeviceInfo.isTablet(),
                // deviceCountry: DeviceInfo.getDe,
                ip: DeviceInfo.getIpAddressSync(),
                uniqueDeviceId: DeviceInfo.getUniqueId(),
                pixelRatio: PixelRatio.get()
                
            }
            return staticInfo;
        }catch(e){
            console.warn(e);
            return {}
        }
    }

    static async getInfo(): Promise<TDeviceInfo>{
        try{

           // const { tracker } = redux.getStore()
           
            return{
                ...Device.getStaticInfo(),
                battaryLevel: await DeviceInfo.getBatteryLevel(),
                locationEnabled: await DeviceInfo.isLocationEnabled(),
                freeDiskStorage: await DeviceInfo.getFreeDiskStorage(),
                // accessGeolocation: tracker.access,
                // errorGeolocation: tracker.error,
                // currentLocation: tracker.currentLocation

            }
        }catch(e){
            console.warn(e);
            return {}
        }
    }
}

export default Device;