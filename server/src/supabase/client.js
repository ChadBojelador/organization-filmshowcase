const { createClient } = require("@supabase/supabase-js");
const env = require("../config/env");

let supabaseClient = null;

function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  if (!env.supabaseConfigured) {
    return null;
  }

  supabaseClient = createClient(env.supabaseUrl, env.supabaseAnonKey);
  return supabaseClient;
}

module.exports = {
  getSupabaseClient,
};
