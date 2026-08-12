# Ghost → GitHub deploy relay (instant publish)

Turns a Ghost "content changed" webhook into a GitHub `repository_dispatch`, which
triggers the **Build & Deploy** workflow. Result: Aiden publishes in Ghost and the
site rebuilds automatically — no GitHub access needed, no waiting for the hourly cron.

```
Ghost publish  →  webhook  →  Lambda Function URL  →  GitHub repository_dispatch  →  Build & Deploy  →  live in ~3–5 min
```

The workflow already listens for this: `.github/workflows/deploy.yml` →
`repository_dispatch: types: [ghost-publish]`.

---

## Step 1 — Create a GitHub token

1. GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. **Repository access:** Only select repositories → **`Avenir_Admissions`**.
3. **Permissions:** Repository permissions → **Contents: Read and write** (required for `repository_dispatch`).
4. **Expiration:** set long-lived (or a calendar reminder to rotate it).
5. Generate and **copy the token** (`github_pat_...`). You'll paste it into the Lambda env, not the repo.

## Step 2 — Make a webhook secret

Generate a long random string (this authenticates Ghost → Lambda). This is a
**one-time value** — where you generate it doesn't matter and your computer does
**not** need to stay on afterward; the string just gets stored in AWS + Ghost,
both of which are always on.

Easiest option — run it in **AWS CloudShell** so no local machine is involved:

1. In the AWS Console top bar, click the **CloudShell** icon (`>_`), or search "CloudShell".
2. In the browser terminal that opens, run:
   ```bash
   openssl rand -hex 32
   ```
3. Copy the output.

(You can run the same command in any terminal — a password manager's random
generator works too. It's just a random string.)

Keep it handy — the same value goes in **both** the Lambda env (`WEBHOOK_SECRET`)
and the Ghost webhook URL (`?secret=...`).

## Step 3 — Create the Lambda

**AWS Console → Lambda → Create function → Author from scratch**

- **Name:** `ghost-deploy-relay`
- **Runtime:** Node.js 24.x (latest stable; 22.x is also fine — avoid the 26.x preview)
- **Architecture:** arm64 (cheaper) or x86_64 — either is fine

Then:

1. **Code:** replace the contents of `index.mjs` with this folder's [`index.mjs`](./index.mjs), and **Deploy**.
2. **Configuration → Environment variables**, add:
   | Key | Value |
   |-----|-------|
   | `GITHUB_TOKEN` | the fine-grained PAT from Step 1 |
   | `GITHUB_OWNER` | `cdemar` |
   | `GITHUB_REPO` | `Avenir_Admissions` |
   | `WEBHOOK_SECRET` | the string from Step 2 |
   | `EVENT_TYPE` | `ghost-publish` |
3. **Configuration → Function URL → Create function URL**:
   - **Auth type:** NONE (the `?secret=` guards it)
   - Save, and **copy the Function URL** (e.g. `https://abc123.lambda-url.us-west-2.on.aws/`)

## Step 4 — Point Ghost at it

In Ghost Admin → **Settings → Integrations → Website** (the custom integration you made for the Content API) → **Add webhook**:

- **Name:** Rebuild site
- **Event:** **Site changed (rebuild)** — this one event covers publish, update, unpublish, and delete, so a single webhook keeps the site in sync.
- **Target URL:** your Function URL with the secret appended:
  ```
  https://abc123.lambda-url.us-west-2.on.aws/?secret=PASTE_YOUR_SECRET
  ```

Save.

## Step 5 — Test

1. In Ghost, publish (or tweak + update) a post.
2. GitHub → **Actions** → a **Build & Deploy** run should start within seconds.
3. It goes live ~3–5 minutes later.

If nothing triggers, check the Lambda's **CloudWatch logs**:
- `401 Unauthorized` → the `?secret=` doesn't match `WEBHOOK_SECRET`.
- `502` → `GITHUB_TOKEN` is wrong/expired or lacks Contents: write.

---

## Notes

- **Security:** the token never leaves Lambda; Ghost only knows the URL + secret. Rotate the PAT if it ever leaks and update the Lambda env var.
- **Multiple rapid edits:** the workflow's `concurrency` group serializes deploys, so back-to-back publishes queue and run in order (no half-synced state).
- **`repository_dispatch` only triggers workflows on the default branch** (`main`) — which is where `deploy.yml` lives, so this works once the workflow is merged to `main`.
- **Cost:** effectively free — the Lambda runs only on actual content changes (a handful a month).

## Optional — deploy via CLI instead of the console

```bash
cd infra/ghost-webhook-relay
zip function.zip index.mjs
aws lambda create-function \
  --function-name ghost-deploy-relay \
  --runtime nodejs24.x --handler index.handler \
  --zip-file fileb://function.zip \
  --role arn:aws:iam::<ACCOUNT_ID>:role/<lambda-basic-exec-role> \
  --region us-west-2
# then set env vars and create the Function URL:
aws lambda update-function-configuration --function-name ghost-deploy-relay \
  --environment "Variables={GITHUB_TOKEN=...,GITHUB_OWNER=cdemar,GITHUB_REPO=Avenir_Admissions,WEBHOOK_SECRET=...,EVENT_TYPE=ghost-publish}" \
  --region us-west-2
aws lambda create-function-url-config --function-name ghost-deploy-relay \
  --auth-type NONE --region us-west-2
```
