export namespace Sanitizer {
  export function input(input: string): string {
    if (!input) return "";
    return input
      .replace(/'/g, "\\'")
      .replace(/\\/g, "\\\\");
  }
  export function validateIdentifier(identifier: string): boolean {
    const identifierRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    if (!identifierRegex.test(identifier)) {
      throw new Error(`Invalid SQL identifier: ${identifier}`);
    }
    return true;
  }
}
