# Install Field Notes skills for Grok Bot

Grok Bot uses your **Cursor account plugin library**. Skills are installed in
Cursor once; then enabled on the Bot that should act for you.

Do **not** run `/add-plugin` inside the Grok Bot chat. Do **not** clone this
repo onto the Grok Bot computer just to get skills.

## 1. Merge this packaging into the default branch

The default branch of this repo is where `/add-plugin` reads from. Merge the
plugin PR first (or install from a branch only if your Cursor UI lets you pick
a git ref).

## 2. Install the plugin in Cursor (not Grok Bot)

In **Cursor** Agent chat:

```text
/add-plugin thegrantburrow/behavioural-econ-site
```

Or paste the full URL when `/add-plugin` asks for a repo:

```text
https://github.com/thegrantburrow/behavioural-econ-site
```

Install the **field-notes** plugin when prompted.

Alternative: Customize sidebar → Plugins / Skills → add from GitHub → same URL.

## 3. Enable it on the Grok Bot that should act for you

1. Open the **Grok Bot** desktop app.
2. Open the Bot that owns Field Notes work.
3. Go to **Settings → Plugins → Yours**.
4. Turn **field-notes** on for that Bot.

## 4. Confirm the Bot can act with the full skills

In that Bot's composer, type `/` and confirm you see skills such as:

- `field-session`
- `experiment-blueprint`
- `science-behind-article`
- `special-report`
- `smokehouse`
- `authentic-voice`
- `spotted-in-the-wild`
- `live-interactive-session`
- `natural-experiment-breakdown`
- `principle-mechanism-diagram`
- `oscarfinch-feedback-html`
- `article-to-linkedin`

Then give a real task, for example:

```text
/field-session
Write up the next field session from the photos I'll attach. Follow the skill fully.
```

If a skill is missing from `/`, it is almost always because step 3 was skipped
for that Bot.

## 5. Optional Bot description (durable role)

Bot name → Bot settings → description:

```text
You own Field Notes (behavioural-econ-site) content work.
When a task matches a Field Notes skill, invoke and follow that full skill
before writing or changing site files. Do not improvise structure when a
skill exists. Prefer /field-session, /experiment-blueprint,
/science-behind-article, /special-report, /smokehouse, /authentic-voice,
and the other field-notes skills.
Never publish, email, or post externally without my approval.
```
