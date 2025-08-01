import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import auth from "@/routes/auth/auth.index";
import index from "@/routes/index.route";
import recordsIndex from "@/routes/records/records.index";

const app = createApp();

configureOpenAPI(app);

const routes = [
  index,
  auth,
  recordsIndex,
] as const;

routes.forEach((route) => {
  app.route("/", route);
});

export type AppType = typeof routes[number];

export default app;
