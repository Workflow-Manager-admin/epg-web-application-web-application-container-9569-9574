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