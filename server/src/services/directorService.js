// server/src/services/directorService.js
const bcrypt = require("bcrypt");
const { getSupabaseClient } = require("../supabase/client");
const { createHttpError } = require("../utils/httpError");

const SALT_ROUNDS = 10;

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

function mapSupabaseError(error, fallbackMessage) {
  if (error?.code === "23505") {
    return createHttpError(409, "Director with this email already exists.");
  }

  return createHttpError(400, error?.message || fallbackMessage);
}

async function registerDirectorWithMembers(payload) {
  const client = requireSupabaseClient();
  const { name, email, password, members } = payload;

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const { data: director, error: directorError } = await client
    .from("Directors")
    .insert({
      name,
      email,
      password: hashedPassword,
    })
    .select("id, name, email")
    .single();

  if (directorError) {
    throw mapSupabaseError(directorError, "Failed to create director.");
  }

  if (!members.length) {
    return {
      director,
      members: [],
    };
  }

  const membersPayload = members.map((member) => ({
    name: member.name,
    role: member.role,
    director_id: director.id,
  }));

  const { data: insertedMembers, error: membersError } = await client
    .from("Members")
    .insert(membersPayload)
    .select("id, name, role, director_id");

  if (membersError) {
    await client.from("Directors").delete().eq("id", director.id);
    throw mapSupabaseError(membersError, "Failed to create members.");
  }

  return {
    director,
    members: insertedMembers || [],
  };
}

module.exports = {
  registerDirectorWithMembers,
};
