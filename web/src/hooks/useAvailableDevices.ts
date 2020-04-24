import { useEffect, useState } from "react";

import {
  getVideoDeviceInfoList,
  getAudioDeviceInfoList,
} from "../media/devices";

type VideoDeviceInfoList = ReturnType<
  typeof getVideoDeviceInfoList
> extends Promise<infer T>
  ? T
  : never;

export const useVideoDevices = () => {
  const [devices, setDevices] = useState<VideoDeviceInfoList>([]);
  useEffect(() => {
    (async () => {
      const deviceInfoList = await getVideoDeviceInfoList();
      setDevices(deviceInfoList);
    })();
  }, []);
  return devices;
};

type AudioDeviceInfoList = ReturnType<
  typeof getAudioDeviceInfoList
> extends Promise<infer T>
  ? T
  : never;

export const useAudioDevices = () => {
  const [devices, setDevices] = useState<AudioDeviceInfoList>([]);
  useEffect(() => {
    (async () => {
      const deviceInfoList = await getAudioDeviceInfoList();
      setDevices(deviceInfoList);
    })();
  }, []);
  return devices;
};
