# Jeffrey Walker Portfolio

React portfolio website for a controls, robotics, and autonomy engineer. The site is built as a small Vite app with page content and asset paths centralized so you can update media and copy without changing layout code.

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal, usually `http://localhost:5173`.

## Where to edit text and links

Most portfolio content lives in:

- `src/data/portfolio.js`

Edit that file to change:

- your email, GitHub, LinkedIn, and resume link
- project descriptions and section text
- asset filenames and labels
- skills, experience bullets, and contact cards

## Where to put files

Put all drop-in assets under `public/assets/`.

### Resume and documents

- `public/assets/docs/jeffrey-walker-controls-resume.pdf`
- `public/assets/docs/jeffrey-walker-robotics-resume.pdf`
- `public/assets/docs/jeffrey-walker-research-resume.pdf`
- `public/assets/docs/jeffrey-walker-master-resume.pdf`
- `public/assets/docs/jeffrey-walker-master-resume.html`
- `resume/jeffrey-walker-master-resume.md`
- `resume/jeffrey-walker-master-resume.tex`
- `resume/jeffrey-walker-controls-resume.tex`
- `resume/jeffrey-walker-robotics-resume.tex`
- `resume/jeffrey-walker-research-resume.tex`

### Headshot

- `public/assets/headshot/jeffrey-walker-headshot.jpg`

### F-18 project media

- `public/assets/f18/velocity-response.png`
- `public/assets/f18/altitude-response.png`
- `public/assets/f18/attitude-response.png`
- `public/assets/f18/control-inputs.png`
- `public/assets/f18/open-loop-composite.png`
- `public/assets/f18/open-loop-long-horizon.png`

### SpiRob project media

- `public/assets/spirob/hardware-overview.jpg`
- `public/assets/spirob/electronics-bench.jpg`
- `public/assets/spirob/segment-detail.jpg`
- `public/assets/spirob/spirob-motion-demo.mp4`
- `public/assets/spirob/mujoco-overview.png`
- `public/assets/spirob/spirobs.xml`
- `public/assets/spirob/Spirobs1.xml`

## Supported media behavior

- Missing image or video files fall back to an in-page asset notice instead of breaking the layout.
- Videos render with native controls.
- PDFs are linked directly from the resume and contact areas.

## Files that matter most

- `src/App.jsx`: page composition and navigation
- `src/data/portfolio.js`: all main content and asset paths
- `src/components/ui.jsx`: reusable UI primitives and media panel
- `src/styles.css`: full visual system
- `resume/jeffrey-walker-master-resume.md`: editable master resume source
- `resume/jeffrey-walker-master-resume.tex`: PDF source for compiled resume output
- `resume/README.md`: variant overview and compile instructions

## Deploy to Vercel

This repo now includes [vercel.json](/Users/jeffreywalker/Portfolio/vercel.json) so direct routes like `/projects/f18` work correctly after deployment.

Recommended path:

1. Push this repo to GitHub.
2. Sign in to Vercel and import the GitHub repository.
3. Let Vercel detect the framework as `Vite`.
4. Keep the default build command: `npm run build`
5. Keep the default output directory: `dist`
6. Deploy

After that, every push to the connected branch will trigger a new deployment.

## Deployment notes

- The site is a normal static web app, not a desktop app.
- Vercel will host it behind a shareable URL.
- The SPA rewrite in `vercel.json` ensures browser refreshes on nested routes do not 404.
