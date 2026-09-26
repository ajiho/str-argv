export default function strArgv(input: string, env?: string, file?: string): string[] {
  const args: string[] = [];

  if (env !== undefined) {
    args.push(env);
  }

  if (file !== undefined) {
    args.push(file);
  }

  let current = "";
  let quote: "'" | '"' | null = null;
  let escaped = false;
  let hasToken = false;

  const push = () => {
    if (!hasToken) {
      return;
    }

    args.push(current);
    current = "";
    hasToken = false;
  };

  for (const char of input) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      hasToken = true;
      continue;
    }

    if (quote !== null) {
      if (char === quote) {
        quote = null;
      } else {
        current += char;
      }

      hasToken = true;
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      hasToken = true;
      continue;
    }

    if (/\s/.test(char)) {
      push();
      continue;
    }

    current += char;
    hasToken = true;
  }

  if (escaped) {
    current += "\\";
  }

  if (quote !== null) {
    throw new Error(`Unclosed quote: ${quote}`);
  }

  push();

  return args;
}
