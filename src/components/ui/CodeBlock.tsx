import { Highlight, type PrismTheme } from "prism-react-renderer";
import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const BLANK = "___";

// Цвета берём из CSS-переменных, поэтому тёмная тема работает без второй темы Prism.
const theme: PrismTheme = {
  plain: { color: "var(--code-ink)", backgroundColor: "transparent" },
  styles: [
    { types: ["comment"], style: { color: "var(--code-comment)", fontStyle: "italic" } },
    { types: ["keyword", "boolean", "builtin"], style: { color: "var(--code-keyword)" } },
    { types: ["string", "char", "template-string"], style: { color: "var(--code-string)" } },
    { types: ["number"], style: { color: "var(--code-number)" } },
    { types: ["function", "class-name"], style: { color: "var(--code-function)" } },
    { types: ["punctuation", "operator"], style: { color: "var(--code-punctuation)" } },
  ],
};

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  /** Что подставить на место `___` в коде (слот fill-blank). */
  blank?: ReactNode;
  className?: string;
}

export function CodeBlock({
  code,
  language = "javascript",
  showLineNumbers = false,
  blank,
  className,
}: CodeBlockProps) {
  return (
    <Highlight code={code} language={language} theme={theme}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <pre
          className={cn(
            "overflow-x-auto rounded-2xl bg-code-bg p-4 font-mono text-[13px] leading-6",
            className,
          )}
        >
          <code>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {showLineNumbers && (
                  <span className="mr-4 inline-block w-4 text-right text-ink-muted/60 select-none">
                    {i + 1}
                  </span>
                )}
                {line.map((token, j) => {
                  const props = getTokenProps({ token });
                  if (blank === undefined || !token.content.includes(BLANK)) {
                    return <span key={j} {...props} />;
                  }
                  const [before, after] = token.content.split(BLANK);
                  return (
                    <Fragment key={j}>
                      <span {...props}>{before}</span>
                      {blank}
                      <span {...props}>{after}</span>
                    </Fragment>
                  );
                })}
              </div>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  );
}
