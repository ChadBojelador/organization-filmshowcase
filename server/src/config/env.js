const dotenv = require("dotenv");
const { z } = require("zod");

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  CLIENT_URL: z.string().default("http://localhost:5173"),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required."),
  JWT_EXPIRES_IN_SECONDS: z.coerce.number().int().positive().default(86400),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment variables: ${parsed.error.message}`);
}

const env = {
  port: parsed.data.PORT,
  clientUrl: parsed.data.CLIENT_URL,
  supabaseUrl: parsed.data.SUPABASE_URL || "",
  supabaseAnonKey: parsed.data.SUPABASE_ANON_KEY || "",
  jwtSecret: parsed.data.JWT_SECRET,
  jwtExpiresInSeconds: parsed.data.JWT_EXPIRES_IN_SECONDS,
};

env.supabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);

module.exports = env;
