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

## Troubleshooting 404 errors for `bundle.js`

If you see a 404 error for `bundle.js` (or main.[hash].js) when loading the app:

**Checklist:**
1. After running `npm run build`, ensure the `build/static/js` folder exists and contains a file like `main.[hash].js`. 
   - There is intentionally no `bundle.js` in modern Create React App; it should be `main.[hash].js`.
   - The built `index.html` will reference the correct hashed filename.

2. **Do not try to open `build/index.html` directly in the browser**  
   - It must be served via a static server: use `npm run serve` or `npx serve -s build`.

3. **Check for misconfigured static hosting (e.g., on your server or cloud host)**  
   - The server should correctly serve files inside the `build` directory and respect React's routing.

4. **Check your public path/Base URL (PUBLIC_URL or homepage in package.json):**
   - If deploying at a subpath, set `homepage` in `package.json` appropriately.
   - For most SPAs deployed at site root, omit `homepage` entirely (the default in this repo).

5. **For development:**  
   - Use `npm start` only.

6. **If you see 404s pointing to `/bundle.js`:**  
   - Make sure no legacy config, service worker, or server is trying to load a file called `bundle.js`. Modern React apps use hashed filenames such as `main.xxxxx.js`, not `bundle.js`.

7. Clean build and reinstall if you have issues:
   ```sh
   rm -rf node_modules build
   npm install
   npm run build
   npm run serve
   ```

8. If deploying to production, be sure to use a static server setup that mirrors the above local `serve -s build` pattern.

For more details, see Create React App deployment docs:
https://facebook.github.io/create-react-app/docs/deployment

2. **Check no extraneous `homepage` or `PUBLIC_URL` is set**  
   - There should be NO `"homepage"` field in `package.json` unless deploying to a subpath.
   - `.env` file should NOT define `PUBLIC_URL` unless needed.

3. **Clear your caches and do a clean install**  
   ```
   rm -rf node_modules build
   npm install
   npm start
   ```

4. **If deploying behind a proxy, ensure the root path is correct**  
   - If serving at a subpath, adjust `homepage` and static server config accordingly.
   - For default single-page deployments, no extra config is needed.

5. **Consult Create React App documentation**  
   https://facebook.github.io/create-react-app/docs/deployment
