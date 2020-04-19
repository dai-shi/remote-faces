import { useEffect, useState } from "react";

import { getVideoDeviceInfoList } from "../media/capture";

type DeviceInfoList = ReturnType<typeof getVideoDeviceInfoList> extends Promise<
  infer T
>
  ? T
  : never;

export const useVideoDevices = () => {
  const [devices, setDevices] = useState<DeviceInfoList>([]);
  useEffect(() => {
    (async () => {
      const deviceInfoList = await getVideoDeviceInfoList();
      setDevices(deviceInfoList);
    })();
  }, []);
  return devices;
};
