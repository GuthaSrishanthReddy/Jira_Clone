declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    DIRECT_URL: string;
    JWT_SECRET: string;
    GEMINI_API_KEY?: string;
    GEMINI_MODEL?: string;
    GITHUB_TOKEN?: string;
  }
}
