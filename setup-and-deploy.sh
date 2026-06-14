#!/bin/bash
# Eternal Residency — one-shot setup & deploy
# Run this from the eternal-residency folder: bash setup-and-deploy.sh

set -e
cd "$(dirname "$0")"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Eternal Residency — Setup & Deploy"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ── 1. Check for .env.local ──────────────────────────────────────────────────
if [ ! -f ".env.local" ]; then
  echo "⚠️  No .env.local found. Creating from example..."
  cp .env.local.example .env.local
  echo ""
  echo "👉  Open .env.local and fill in:"
  echo "    STRIPE_SECRET_KEY     — from https://dashboard.stripe.com/apikeys"
  echo "    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
  echo "    ADMIN_PASSWORD        — choose any strong password"
  echo ""
  read -p "Press Enter once you've saved .env.local..."
fi

# ── 2. Install dependencies ──────────────────────────────────────────────────
echo "📦  Installing dependencies..."
npm install
echo "✅  Done."
echo ""

# ── 3. Deploy to Vercel ─────────────────────────────────────────────────────
echo "🚀  Deploying to Vercel..."
echo "    (You'll be prompted to log in if needed)"
echo ""
npx vercel deploy --prod

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅  Deployed! "
echo ""
echo "  Next steps:"
echo "  1. In Vercel dashboard → your project → Settings → Environment Variables"
echo "     Add: STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, ADMIN_PASSWORD"
echo "  2. Redeploy once to pick up the env vars"
echo "  3. Your admin dashboard is at: https://your-domain.vercel.app/admin"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
