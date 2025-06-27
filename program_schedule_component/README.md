# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Environment Setup: Backend API URL

**IMPORTANT:**  
Ensure you create a `.env` file based on `.env.example` with a valid backend API URL.  
- **Do NOT use `0.0.0.0` as a host!**  
- Use `localhost` for local dev:  
  ```
  REACT_APP_EPG_BACKEND_URL=http://localhost:8000/api/epg/programs
  ```
- For production, set the proper backend hostname or IP.

If you see errors like `connect ECONNREFUSED 0.0.0.0:8000` in the browser or dev tools, it usually means:
1. The backend URL is wrongly set to `0.0.0.0` (which is never a public address).
2. The backend server isn't running or isn't listening on `localhost:8000`.

**Troubleshooting steps:**
- Check your `.env` file and ensure the variable is set as shown above.
- Restart your React dev server after editing the `.env` (run `npm start` again).
- Ensure your backend server is running and listening on the right address.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

#### To preview/build locally

After building:

```sh
npm run build
npm run serve
```

This will launch a static server at http://localhost:3000 (default) serving your production bundle from the `build` directory.
- Your JS bundle files (e.g. static/js/main.[hash].js) and index.html should reside in the **build** folder.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

---

## Production Deployment: Web Server Configuration for Create React App

### General Principle

The build output (`npm run build`) generates hashed filenames in `build/static/js` and `build/static/css`.  
**There will never be a `bundle.js`**; requests to `/bundle.js` will 404.  
All web server configs must:
- Serve static assets from `build/` and `build/static/`.
- Route *all unknown requests* (non-static file requests) to `build/index.html` (for proper client-side routing).

---

### 1. Using the local `serve` tool

- **Recommended for testing locally.**
- Run:
    ```sh
    npm run build
    npm run serve
    ```
- This runs `npx serve -s build`, which handles static files and SPA fallback automatically (routes unknown paths to `index.html`).
- **Do not open `index.html` from disk in the browser.**

---

### 2. Node.js/Express Example

```js
const express = require('express');
const path = require('path');
const app = express();

const buildPath = path.join(__dirname, 'build');

app.use(express.static(buildPath));

// Serve index.html for all non-static-file routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serving app on http://localhost:${PORT}`);
});
```

---

### 3. NGINX Example

(Place this in your NGINX server config, or a custom `location` block.)

```
server {
    listen 80;
    server_name example.com;  # Change to your domain

    root /path/to/your/build;

    # Serve static files first
    location /static/ {
        alias /path/to/your/build/static/;
        expires 1y;
        add_header Cache-Control "public";
    }

    # Fallback for all SPA routes to index.html
    location / {
        try_files $uri /index.html;
    }
}
```

---

### 4. Apache Example (`.htaccess` in your build dir)

Enable RewriteEngine and add:

```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  # Redirect all requests not matching a file/folder to index.html
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Serve static assets with long cache for /static/
<IfModule mod_headers.c>
  <FilesMatch "\.(js|css|png|jpg|svg|woff2)$">
    Header set Cache-Control "max-age=31536000, public"
  </FilesMatch>
</IfModule>
```

---

### 5. Bundler/Static File Requests: Preventing Broken `/bundle.js` Loading

- **Modern Create React App will reference hashed JS/CSS files in your built `index.html`.**
- Never reference `/bundle.js` or `/main.js` directly in your HTML or service worker code.
- If you see calls for `/bundle.js`, check:
  - No legacy code trying to load `bundle.js` (audit your HTML/JS for these references).
  - No custom service workers or outdated caches are forcing this request (clear your browser cache and Service Workers).
  - No misconfiguration in your hosting provider that rewrites requests wrong.

---

### 6. Troubleshooting and Clean Setup

- Clean install if you encounter persistent static file problems:
    ```sh
    rm -rf node_modules build
    npm install
    npm run build
    npm run serve
    ```
- If deploying to production, use only one of the above static server patterns and ensure fallback to `index.html` for all non-static file routes.

---

For more details, see the Create React App [deployment documentation](https://facebook.github.io/create-react-app/docs/deployment).

