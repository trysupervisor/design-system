import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import postcss from "postcss";
import { Device } from "../src/components/examples/registry/device";
import { deviceFrames, getDeviceFrame, type DeviceModel } from "../src/components/examples/registry/device-frames";

describe("PNG device frames", () => {
  test("renders every real frame with accessible content and no image proxy", () => {
    expect(Object.keys(deviceFrames).sort()).toEqual(["android", "ipad", "iphone", "macbook"]);
    for (const model of Object.keys(deviceFrames) as DeviceModel[]) {
      const frame = getDeviceFrame(model);
      const html = renderToStaticMarkup(createElement(Device, { model, "aria-label": "Project preview", className: "my-device", style: { maxWidth: 320 } }, createElement("button", { type: "button" }, "Open project")));
      expect(html).toContain('aria-label="Project preview"');
      expect(html).toContain('class="my-device"');
      expect(html).toContain("max-width:320px");
      expect(html).toContain(`aspect-ratio:${frame.width} / ${frame.height}`);
      expect(html).toContain(`<button type="button">Open project</button>`);
      expect(html).toContain(`src="${frame.src}"`);
      expect(html).not.toContain("/_next/image");
      expect(html).toContain('alt=""');
      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain('data-slot="device-frame"');
      expect(frame.src).toEndWith("-transparent.png");
    }
  });

  test("supports local PNGs and custom measured screen geometry", () => {
    const frame = { name: "Custom phone", src: "/my-frame.png", width: 500, height: 1000, screen: { x: 25, y: 50, width: 450, height: 900, radius: 25 } };
    const html = renderToStaticMarkup(createElement(Device, { frame, frameSrc: "/local-frame.png", screenClassName: "my-screen", screenStyle: { backgroundColor: "red" } }, createElement("span", null, "My app")));
    expect(html).toContain('src="/local-frame.png"');
    expect(html).toContain('class="my-screen"');
    expect(html).toContain("left:5%;top:5%;width:90%;height:90%");
    expect(html).toContain("background-color:red");
    expect(html).toContain("My app");
    expect(html).not.toContain("webmobilefirst");
  });

  test("rejects invalid custom geometry before rendering a broken frame", () => {
    const frame = deviceFrames.iphone;
    expect(() => getDeviceFrame("missing" as DeviceModel)).toThrow("Unknown device model");
    expect(() => getDeviceFrame("iphone", { ...frame, width: 0 })).toThrow("must fit");
    expect(() => getDeviceFrame("iphone", { ...frame, height: Number.NaN })).toThrow("must fit");
    expect(() => getDeviceFrame("iphone", { ...frame, screen: { ...frame.screen, width: frame.width } })).toThrow("must fit");
    expect(() => getDeviceFrame("iphone", { ...frame, screen: { ...frame.screen, radius: 1000 } })).toThrow("must fit");
    expect(() => getDeviceFrame("iphone", { ...frame, src: "" })).toThrow("source is required");
  });

  test("keeps PNG chrome decorative and screen content clipped", async () => {
    const css = postcss.parse(await Bun.file(new URL("../src/components/examples/registry/device.css", import.meta.url)).text());
    const rules = new Map<string, Map<string, string>>();
    css.walkRules((rule) => {
      const declarations = new Map<string, string>();
      rule.walkDecls((declaration) => { declarations.set(declaration.prop, declaration.value); });
      rules.set(rule.selector, declarations);
    });
    expect(rules.get('[data-slot="device-frame"]')?.get("pointer-events")).toBe("none");
    expect(rules.get('[data-slot="device-screen"]')?.get("overflow")).toBe("hidden");
    expect(rules.get('[data-slot="device-screen"]')?.get("position")).toBe("absolute");
    expect(rules.get('[data-slot="device"]')?.get("isolation")).toBe("isolate");
  });
});
