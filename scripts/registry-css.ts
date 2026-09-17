import postcss, { type Container } from "postcss";

export type CssRules = { [key: string]: string | CssRules };

function mergeRules(target: CssRules, source: CssRules) {
  for (const [key, value] of Object.entries(source)) {
    const previous = target[key];
    if (typeof previous === "object" && typeof value === "object") {
      mergeRules(previous, value);
    } else {
      target[key] = value;
    }
  }
}

function readRules(container: Container, excludedVariables: ReadonlySet<string>): CssRules {
  const rules: CssRules = {};
  for (const node of container.nodes ?? []) {
    if (node.type === "decl") {
      const variables = [...node.value.matchAll(/var\(--([a-z0-9-]+)/g)];
      if (variables.some((match) => excludedVariables.has(match[1]))) continue;
      rules[node.prop] = node.value + (node.important ? " !important" : "");
    } else if (node.type === "rule" || node.type === "atrule") {
      if (node.type === "atrule" && ["theme", "custom-variant"].includes(node.name)) continue;
      if (node.type === "rule" && [":root", ".dark"].includes(node.selector)) continue;
      const key = node.type === "rule" ? node.selector : `@${node.name}${node.params ? ` ${node.params}` : ""}`;
      const contents = readRules(node, excludedVariables);
      if (Object.keys(contents).length) mergeRules(rules, { [key]: contents });
    }
  }
  return rules;
}

export function registryCssRules(source: string, excludedVariables: ReadonlySet<string>): CssRules {
  return readRules(postcss.parse(source), excludedVariables);
}
