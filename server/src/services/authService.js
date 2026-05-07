const { getSupabaseClient } = require("../supabase/client");
const { createHttpError } = require("../utils/httpError");

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

async function signInWithPassword({ email, password }) {
  const client = requireSupabaseClient();

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw createHttpError(400, error.message);
  }

  return data;
}

async function signUpWithPassword({ email, password, fullName }) {
  const client = requireSupabaseClient();

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: fullName ? { full_name: fullName } : undefined,
    },
  });

  if (error) {
    throw createHttpError(400, error.message);
  }

  return data;
}

module.exports = {
  signInWithPassword,
  signUpWithPassword,
};
