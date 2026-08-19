/**
 * Shared auth helpers used across pages.
 */

// Redirects to login if there's no active session. Call this at the
// top of any "protected" page (select.html, dishes.html, recipe.html).
async function requireSession() {
  const { data, error } = await window.sb.auth.getSession();
  if (error || !data.session) {
    window.location.href = "index.html";
    return null;
  }
  return data.session;
}

// If the user is ALREADY logged in and lands on the login page,
// send them straight past it — this is the "don't ask again" behavior.
async function redirectIfLoggedIn(destination) {
  const { data } = await window.sb.auth.getSession();
  if (data && data.session) {
    window.location.href = destination;
  }
}

function displayNameFromEmail(email) {
  if (!email) return "";
  const namePart = email.split("@")[0];
  return namePart.charAt(0).toUpperCase() + namePart.slice(1);
}

function initials(email) {
  const name = displayNameFromEmail(email);
  return name.slice(0, 2).toUpperCase();
}

async function mountUserBadge(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  const { data } = await window.sb.auth.getUser();
  const user = data && data.user;
  if (!user) return;
  el.innerHTML =
    '<span class="avatar">' + initials(user.email) + "</span>" +
    "<span>" + displayNameFromEmail(user.email) + "</span>";
}

async function logout() {
  await window.sb.auth.signOut();
  window.location.href = "index.html";
}
