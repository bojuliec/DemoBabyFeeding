# Shannon's Solids 🥦

Baby food introduction tracker based on the Solid Starts guide.

## Deploy to Vercel (recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # Create a new repo on github.com, then:
   git remote add origin https://github.com/YOUR_USERNAME/shannons-solids.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "Add New Project" → select your repo
   - Framework preset: **Create React App** (auto-detected)
   - Click **Deploy** — done in ~60 seconds
   - Your app lives at `shannons-solids.vercel.app`

## Run locally

```bash
npm install
npm start
```

## Notes
- All data is saved to `localStorage` in the browser — no backend needed
- Data persists across sessions on the same device/browser
- To reset data: open browser DevTools → Application → Local Storage → clear keys starting with `shannon-`
