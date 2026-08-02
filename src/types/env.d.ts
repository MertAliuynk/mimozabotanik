// Environment configuration
declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    JWT_SECRET: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}