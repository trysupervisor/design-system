"use client";

import { Highlight, Prism, type PrismTheme } from "prism-react-renderer";

export type CodeLanguage = "tsx" | "css" | "sh" | "json";

Prism.languages.sh = {
  comment: { pattern: /(^|\s)#[^\r\n]*/, lookbehind: true },
  string: [
    { pattern: /"(?:\\[\s\S]|[^"\\])*"/, greedy: true },
    { pattern: /'[^']*'/, greedy: true },
    { pattern: /`(?:\\[\s\S]|[^`\\])*`/, greedy: true },
  ],
  variable: /\$(?:\{[^}\r\n]+\}|[A-Za-z_][\w]*|[0-9@*#?$!_-])/,
  keyword: /\b(?:if|then|else|elif|fi|for|while|do|done|case|esac|in|function|select|until)\b/,
  builtin: /\b(?:bun|bunx|cd|echo|export|printf|pwd|read|source|test|unset)\b/,
  parameter: { pattern: /(^|\s)--?[\w][\w-]*/, lookbehind: true },
  operator: /&&|\|\||[|&;<>]/,
  punctuation: /[()[\]{}]/,
};

const cssTheme: PrismTheme = { plain: {}, styles: [] };

export function SyntaxCode({ code, language, label }: { code: string; language: CodeLanguage; label: string }) {
  const lineBreaks = code.match(/\r\n|\r|\n/g) ?? [];

  return (
    <Highlight prism={Prism} code={code} language={language} theme={cssTheme}>
      {({ tokens, className, getTokenProps }) => (
        <pre className={`syntax-highlight ${className}`} tabIndex={0} aria-label={label}>
          <code>{tokens.map((line, lineIndex) => (
            <span key={lineIndex} className="syntax-line">
              {line.map((token, tokenIndex) => (
                <span {...getTokenProps({ token })} key={tokenIndex}>{token.empty ? "" : token.content}</span>
              ))}
              {lineBreaks[lineIndex] ?? ""}
            </span>
          ))}</code>
        </pre>
      )}
    </Highlight>
  );
}
