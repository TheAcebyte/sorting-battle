process.loadEnvFile();

export const env = {
  PORT: process.env.PORT!,
  PASSWORD: process.env.PASSWORD!,
  SESSION_SECRET: process.env.SESSION_SECRET!,
} as const;
