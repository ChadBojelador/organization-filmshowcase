// server/src/services/loginService.js
const bcrypt = require("bcrypt");
const { getSupabaseClient } = require("../supabase/client");
const { createHttpError } = require("../utils/httpError");
const { createJwtToken } = require("../utils/jwt");

function requireSupabaseClient() {
  const client = getSupabaseClient();

  if (!client) {
    throw createHttpError(
      500,
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in server/.env."
    );
  }

  return client;
}

async function loginDirector({ email, password }) {
  const client = requireSupabaseClient();

  const { data: director, error } = await client
    .from("Directors")
    .select("id, name, email, password")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw createHttpError(500, "Failed to fetch director account.");
  }

  if (!director) {
    throw createHttpError(401, "Invalid email or password.");
  }

  if (!director.password) {
    throw createHttpError(401, "Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(password, director.password);

  if (!isPasswordValid) {
    throw createHttpError(401, "Invalid email or password.");
  }

  const token = createJwtToken({
    sub: director.id,
    email: director.email,
    role: "director",
  });

  return {
    token,
    director: {
      id: director.id,
      name: director.name,
      email: director.email,
    },
  };
}

module.exports = {
  loginDirector,
};
