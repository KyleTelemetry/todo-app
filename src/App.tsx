import {
  createBrowserRouter,
  RouterProvider,
  useLoaderData,
} from "react-router";
import { Render } from "./views/Render";
import { Settings } from "./views/Settings";
import { configure } from "@telemetryos/sdk";

configure("todo");
const router = createBrowserRouter([
  {
    path: "/render",
    Component: Render,
  },
  {
    path: "/settings",
    Component: Settings,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
