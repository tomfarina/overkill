import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Overkill from "./Overkill";
import * as serviceWorker from "./serviceWorker";
import { AccountsProvider } from "./contexts/accounts.context";

ReactDOM.render(
  <React.StrictMode>
    <AccountsProvider>
      <Overkill />
    </AccountsProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
