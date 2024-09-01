export class QiuError extends Error {
  constructor(
    message: string,
    public query: string,
    public dbType: string,
    public suggestion: string
  ) {
    super();
    this.name = "QiuError";
    this.message = this.formatErrorMessage(message, query, dbType, suggestion);
  }

  private formatErrorMessage(
    message: string,
    query: string,
    dbType: string,
    suggestion: string
  ): string {
    const messageBlock = `\x1b[31m\x1b[1mError: ${message}\x1b[0m`; // Red bold
    const queryBlock = `\x1b[33m\x1b[1mQuery Executed: \x1b[0m${query}`; // Yellow bold
    const dbTypeBlock = `\x1b[33m\x1b[1mDatabase Type: \x1b[0m${dbType}`; // Yellow bold
    const suggestionBlock = `\x1b[36m\x1b[1mSuggestion: \x1b[0m${suggestion}`; // Cyan bold

    return `
${messageBlock}
${queryBlock}
${dbTypeBlock}
${suggestionBlock}
    `.trim();
  }
}
