import { lazy } from "solid-js";

interface AppRoute {
  path: string;
  component: any;
  exact?: boolean;
  children?: AppRoute[];
}

const routes: Array<AppRoute> = [
  {
    path: "/",
    component: lazy(() => import("@/App")),
    exact: true,
  },
  {
    path: "/",
    component: lazy(() => import("@/routes/AuthRoutes/RouteLayout")),
    children: [
      {
        path: "/profile",
        component: lazy(() => import("@routes/AuthRoutes/Profile")),
      },
      {
        path: "/game",
        component: lazy(() => import("@routes/AuthRoutes/Game")),
      },
    ],
  },
];

export default routes;
