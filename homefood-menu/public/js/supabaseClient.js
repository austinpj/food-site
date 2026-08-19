/**
 * Initializes a single shared Supabase client.
 * Relies on window.SUPABASE_URL / window.SUPABASE_ANON_KEY from config.js
 * and the Supabase JS library loaded via CDN in each HTML page.
 *
 * supabase-js persists the session in localStorage and auto-refreshes
 * the access token, which is what gives us "stay logged in" behavior
 * across visits without asking the user to log in again.
 */
(function () {
  if (!window.supabase || !window.supabase.createClient) {
    console.error("Supabase library not loaded. Check the <script> tag order in this page.");
    return;
  }

  const url = window.SUPABASE_URL;
  const key = window.SUPABASE_ANON_KEY;

  if (!url || url.indexOf("YOUR_SUPABASE") === 0) {
    console.warn(
      "Supabase is not configured yet. Open js/config.js and paste in your " +
      "Project URL and anon public key from the Supabase dashboard (Settings > API)."
    );
  }

  window.sb = window.supabase.createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
})();
