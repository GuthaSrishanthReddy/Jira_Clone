declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    DIRECT_URL: string;
    JWT_SECRET: string;
    CLAUDE_API_KEY?: string;
    CLAUDE_MODEL?: string;
    GITHUB_TOKEN?: string;
  }
}
