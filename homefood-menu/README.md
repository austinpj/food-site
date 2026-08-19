# Home Kitchen — Setup & Deploy Guide

A multi-page home food menu site: sign up / log in (stays logged in),
choose Veg or Non-Veg, browse categories, pick a dish, choose rice or
chapathi, choose how many people you're cooking for, and get an
ingredient list that's automatically scaled to that many people, plus
step-by-step cooking instructions.

No custom backend server is needed — **Supabase** handles real
accounts and keeps people logged in, and the site itself is plain
HTML/CSS/JS that **Vercel** hosts for free, deployed straight from
**GitHub**.

Total setup time: about 10 minutes, almost all of it clicking buttons.

---

## 1. Create your Supabase project (2 min)

1. Go to https://supabase.com/dashboard and click **New project**.
2. Give it any name (e.g. `home-kitchen`), pick a database password
   (you won't need to remember it — nothing in this app touches the
   database directly), pick a region close to you, click **Create**.
3. Once it's ready, go to **Authentication → Providers** and make sure
   **Email** is enabled (it is by default).
4. Optional but recommended for a frictionless demo: go to
   **Authentication → Sign In / Providers → Email** and turn **off**
   "Confirm email" if you don't want new users to have to click a
   confirmation link before they can log in. (If you leave it on,
   that's fine too — new users will just see a "check your email"
   message after signing up.)
5. Go to **Settings → API**. You'll see two values you need:
   - **Project URL**
   - **anon / public** key (a long string starting with `eyJ...`)

   Both of these are safe to put in frontend code — they're designed
   to be public.

6. Open `public/js/config.js` in this project and paste them in:

   ```js
   window.SUPABASE_URL = "https://xxxxxxxx.supabase.co";
   window.SUPABASE_ANON_KEY = "eyJ......your-anon-key......";
   ```

That's the only code edit required. Everything else already works.

---

## 2. Push the code to GitHub (2 min)

If you already know git, just push this folder to a new repo as
usual. If not, the easiest way with no commands at all:

1. Go to https://github.com/new, create a new repository (any name,
   e.g. `home-kitchen`), keep it **Public** or **Private**, don't add
   a README (we already have one).
2. On the new repo's page, click **uploading an existing file**.
3. Drag the entire contents of this project folder into the browser
   window (everything: `public/`, `vercel.json`, `README.md`, etc.)
   and click **Commit changes**.

---

## 3. Deploy on Vercel (1 min)

1. Go to https://vercel.com/new.
2. Under "Import Git Repository," pick the repo you just created.
3. Vercel will detect it as a static site (thanks to `vercel.json`).
   You don't need to change any build settings — just click **Deploy**.
4. In about 30–60 seconds you'll get a live URL like
   `home-kitchen.vercel.app`. That's your real, live, working site —
   open it on your phone, your laptop, anywhere, and accounts/login
   will work the same everywhere because Supabase is the source of
   truth for who's logged in.

Every time you push a change to the GitHub repo afterward, Vercel
redeploys automatically.

---

## 4. Try it

1. Open your new Vercel URL.
2. Create an account (name, email, password).
3. You'll land on the "What are you craving?" screen — pick Veg or
   Non-Veg, pick a category, pick a dish.
4. Choose rice or chapathi, choose how many people, and you'll see
   the recipe with ingredient quantities scaled to that number and
   full step-by-step instructions.
5. Close the tab and come back later — you'll stay logged in.

---

## Swapping in your own (or AI-generated) photos

Every dish currently uses a real, verified stock/Wikimedia photo so
the site looks complete out of the box. If you'd rather use
AI-generated images, see **`ai-image-prompts.md`** in this folder —
it has a ready-to-paste prompt and the exact filename for every dish,
category, and hero image. The process:

1. Generate an image (Bing Image Creator, ChatGPT, Leonardo.ai, etc.
   are all free) using the prompt given for that item.
2. Save it into `public/images/` using the **exact filename** listed.
3. Open `public/data/dishes.json`, find that dish (or category), and
   change its `"image"` field from the remote URL to
   `"images/your-filename.jpg"`.
4. For the 3 hero photos (login screen, Veg card, Non-Veg card), the
   image is set directly in the HTML instead of the JSON:
   - Login hero → `public/index.html`, the `background-image:url(...)`
     on the `auth-visual` element.
   - Veg hero → `public/select.html`, the `<img>` inside `#cardVeg`.
   - Non-veg hero → `public/select.html`, the `<img>` inside `#cardNonveg`.
5. Push the change to GitHub — Vercel redeploys automatically.

You can do this for one dish at a time; nothing breaks if only some
images are swapped.

---

## Project structure

```
public/
  index.html        Login / signup
  select.html        Veg / Non-Veg + category picker
  dishes.html         Dish grid for a chosen category
  recipe.html          Rice/chapathi + people-count flow, scaled recipe
  css/style.css        All styling
  js/config.js          <- put your Supabase URL + key here
  js/supabaseClient.js  Initializes the Supabase client
  js/auth.js            Shared login/session helpers
  data/dishes.json      All 31 dishes: ingredients, steps, images
  images/                (empty — for your own/AI-generated photos)
vercel.json           Tells Vercel to serve the public/ folder
ai-image-prompts.md    Prompt + filename for every image, if you want
                        to regenerate them with AI
```

## How the people-scaling works

Every dish in `data/dishes.json` has a `baseServings` number (4) and
an ingredient list written for that many people. When you pick a
group size on the site, each quantity is multiplied by
`peopleChosen / baseServings` and rounded to a sensible unit (nearest
5g for larger amounts, nearest quarter-unit for spoons, whole pieces
for things like cloves or cardamom pods, minimum of 1). This happens
live in the browser — no server round-trip needed — and updates
instantly if you use the +/- stepper on the recipe page.
