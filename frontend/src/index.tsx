/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import routes from "@/routeConfig";
import { Router } from "@solidjs/router";
import Contexts from "./contexts/Contexts";

const root = document.getElementById("root");

render(
  () => (
    <Contexts>
      <Router>{routes}</Router>
    </Contexts>
  ),
  root!
);
