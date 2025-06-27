# epg-web-application-web-application-container-9569-9574

---

## Running the React EPG Web Application

All source code for the EPG web frontend is under the `program_schedule_component` directory.

**To run, build, or test the application:**

```sh
cd program_schedule_component
npm install
npm start         # For development
npm run build     # For a production build
npm test          # To run tests
```

- Application will be available at http://localhost:3000 by default.

- Configure the backend EPG service URL in `program_schedule_component/.env` based on your deployment.

For further instructions and details on the frontend, see [`program_schedule_component/README.md`](program_schedule_component/README.md).

---

## CI/Build Troubleshooting

If you encounter build errors such as:

```
cd: .../program_schedule_component: No such file or directory
npm error: Could not read package.json: ENOENT: no such file or directory
```
This usually means the build or linter script is looking for the `program_schedule_component` directory in the wrong place.
- Double-check the directory exists at the project root.
- If customizing scripts, ensure references to `program_schedule_component` use the correct relative path.
- For CI, update `.linter.sh` or any related scripts if your structure or location has changed.