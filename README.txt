Render Static package ready.

Important:
- Replace HF_API_KEY in public/config.js with your HuggingFace token (hf_xxx).
- This project calls HuggingFace from the browser (client-side). The token will be publicly visible.
- If you want to keep the token secret, use a serverless proxy instead.

Deploy:
- On Render: Create a new Static Site, upload the 'public' folder contents or the zip.
- Build command: (empty)
- Publish directory: .

Files included:
- public/index.html
- public/style.css
- public/config.js
- public/client.js
- public/games/*
