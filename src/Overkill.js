import React, { useEffect, useReducer, useState } from "react";
import ValorantAPI from "./util/ValorantAPI";
import "./Overkill.css";
import "bulma/css/bulma.css";
import "bulma-prefers-dark/css/bulma-prefers-dark.css";
import Accounts from './components/Accounts';
import useAccountStorage from './util/useAccountStorage';

function Overkill() {
  const [accountStorage, setAccountStorage] = useAccountStorage();

  useEffect(() => {
    ValorantAPI.loadNames();
  }, []);

  return (
    <div className="window">
      <div className="window-titlebar" />
      <div className="app container">
        <div className="main-screen">
          <Accounts
            accountStorage={accountStorage}
            setAccountStorage={setAccountStorage}
          />
        </div>
      </div>
    </div>
  );
}

export default Overkill;
