export type DeviceModel = "iphone" | "ipad" | "macbook" | "android";

export type DeviceFrame = {
  name: string;
  src: string;
  width: number;
  height: number;
  screen: { x: number; y: number; width: number; height: number; radius: number };
};

export const deviceFrames: Record<DeviceModel, DeviceFrame> = {
  iphone: {
    name: "iPhone 17",
    src: "https://www.webmobilefirst.com/img/mockups/mockup-apple-iphone-17-2025-transparent.png",
    width: 388,
    height: 800,
    screen: { x: 16, y: 13, width: 356, height: 774, radius: 62 },
  },
  ipad: {
    name: "iPad Pro",
    src: "https://www.webmobilefirst.com/img/mockups/mockup-apple-ipad-pro-11-2018-transparent.png",
    width: 578,
    height: 800,
    screen: { x: 29, y: 31, width: 518, height: 740, radius: 12 },
  },
  macbook: {
    name: "MacBook Pro 14 inch",
    src: "https://ui.trysupervisor.com/devices/macbook-pro-14-space-black.png",
    width: 1536,
    height: 1024,
    screen: { x: 140, y: 69, width: 1256, height: 799, radius: 18 },
  },
  android: {
    name: "Galaxy S26 Ultra",
    src: "https://www.webmobilefirst.com/img/mockups/mockup-samsung-galaxy-s26-ultra-2026-transparent.png",
    width: 385,
    height: 800,
    screen: { x: 11, y: 10, width: 361, height: 779, radius: 34 },
  },
};

export function getDeviceFrame(model: DeviceModel, customFrame?: DeviceFrame): DeviceFrame {
  const frame = customFrame ?? deviceFrames[model];
  if (!frame) throw new Error(`Unknown device model: ${model}`);
  const { width, height, screen, src } = frame;
  const values = [width, height, screen.x, screen.y, screen.width, screen.height, screen.radius];
  if (values.some((value) => !Number.isFinite(value)) || width <= 0 || height <= 0 || screen.width <= 0 || screen.height <= 0 || screen.x < 0 || screen.y < 0 || screen.radius < 0 || screen.x + screen.width > width || screen.y + screen.height > height || screen.radius > Math.min(screen.width, screen.height) / 2) {
    throw new Error("The device screen must fit inside its PNG frame.");
  }
  if (!src.trim()) throw new Error("A device frame image source is required.");
  return frame;
}
