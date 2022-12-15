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

export const useVideoDevices = (initialId: string) => {
  const [devices, setDevices] = useState<VideoDeviceInfoList>([]);
  const [selectedId, setSelectedId] = useState(initialId);
  useEffect(() => {
    (async () => {
      const deviceInfoList = await getVideoDeviceInfoList();
      setDevices(deviceInfoList);
      setSelectedId(
        (prev) =>
          deviceInfoList.find((deviceInfo) => deviceInfo.deviceId === prev)
            ?.deviceId ||
          deviceInfoList[0]?.deviceId ||
          prev
      );
    })();
  }, []);
  return [devices, selectedId, setSelectedId] as const;
};

type AudioDeviceInfoList = ReturnType<
  typeof getAudioDeviceInfoList
> extends Promise<infer T>
  ? T
  : never;

export const useAudioDevices = (initialId: string) => {
  const [devices, setDevices] = useState<AudioDeviceInfoList>([]);
  const [selectedId, setSelectedId] = useState(initialId);
  useEffect(() => {
    (async () => {
      const deviceInfoList = await getAudioDeviceInfoList();
      setDevices(deviceInfoList);
      setSelectedId(
        (prev) =>
          deviceInfoList.find((deviceInfo) => deviceInfo.deviceId === prev)
            ?.deviceId ||
          deviceInfoList[0]?.deviceId ||
          prev
      );
    })();
  }, []);
  return [devices, selectedId, setSelectedId] as const;
};
