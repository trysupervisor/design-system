import Image from "next/image";
import type { ComponentProps, CSSProperties } from "react";
import { getDeviceFrame, type DeviceFrame, type DeviceModel } from "./device-frames";
import "./device.css";

export { deviceFrames } from "./device-frames";
export type { DeviceFrame, DeviceModel } from "./device-frames";

export type DeviceProps = ComponentProps<"div"> & {
  model?: DeviceModel;
  frame?: DeviceFrame;
  frameSrc?: string;
  screenClassName?: string;
  screenStyle?: CSSProperties;
};

export function Device({ model = "iphone", frame: customFrame, frameSrc, children, className, style, screenClassName, screenStyle, ...props }: DeviceProps) {
  const frame = getDeviceFrame(model, customFrame);
  const { screen } = frame;
  return (
    <div {...props} data-slot="device" data-device={model} className={className} style={{ ...style, aspectRatio: `${frame.width} / ${frame.height}` }}>
      <div
        data-slot="device-screen"
        className={screenClassName}
        style={{
          ...screenStyle,
          left: `${screen.x / frame.width * 100}%`,
          top: `${screen.y / frame.height * 100}%`,
          width: `${screen.width / frame.width * 100}%`,
          height: `${screen.height / frame.height * 100}%`,
          borderRadius: `${screen.radius / screen.width * 100}% / ${screen.radius / screen.height * 100}%`,
        }}
      >
        {children}
      </div>
      <Image
        data-slot="device-frame"
        src={frameSrc ?? frame.src}
        width={frame.width}
        height={frame.height}
        alt=""
        aria-hidden="true"
        draggable={false}
        unoptimized
      />
    </div>
  );
}
