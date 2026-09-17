import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Combobox } from "../src/components/examples/registry/combobox";

describe("Combobox", () => {
  test("renders its label, disabled trigger, and hidden form value", () => {
    const html = renderToStaticMarkup(
      <Combobox
        label="Workspace"
        disabled
        name="workspace"
        form="setup"
        defaultValue="second"
        options={[
          { value: "first", label: "Duplicate" },
          { value: "second", label: "Duplicate" },
        ]}
      />,
    );
    const labelId = html.match(/<label id="([^"]+)"/)?.[1];
    expect(labelId).toBeDefined();
    expect(html).toContain(`<label id="${labelId}"`);
    expect(html).toContain(`aria-labelledby="${labelId}"`);
    expect(html).toContain('data-slot="combobox-trigger"');
    expect(html).toContain('disabled=""');
    expect(html).toContain('<input type="hidden" disabled="" form="setup" name="workspace" value="second"/>');
  });

  test("uses an explicit accessible name when no visible label is present", () => {
    const html = renderToStaticMarkup(
      <Combobox
        aria-label="Choose workspace"
        options={[{ value: "first", label: "First" }]}
      />,
    );
    expect(html).toContain('aria-label="Choose workspace"');
    expect(html).not.toContain("<label");
  });
});
