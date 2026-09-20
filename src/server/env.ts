try {
  process.loadEnvFile();
} catch (error) {
  console.error("Could not load .env file");
}

export const env = {
  PORT: process.env.PORT!,
  PASSWORD: process.env.PASSWORD!,
  SESSION_SECRET: process.env.SESSION_SECRET!,
} as const;
