/* @refresh reload */
import { render } from "solid-js/web";

import "./root.css";
import routes from "@/routeConfig";
import { Router } from "@solidjs/router";
import Contexts from "./contexts/Contexts";
import {
  ColorModeProvider,
  ColorModeScript,
  localStorageManager,
} from "@kobalte/core";

const root = document.getElementById("root");
render(() => <ColorModeScript storageType={"localStorage"} />, document.head);
render(
  () => (
    <ColorModeProvider storageManager={localStorageManager}>
      <Contexts>
        <Router>{routes}</Router>
      </Contexts>
    </ColorModeProvider>
  ),
  root!
);
