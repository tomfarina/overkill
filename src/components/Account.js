import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import "./Account.css";
import Store from "./Store";
import ValorantAPI from "../util/ValorantAPI";

function Account(props) {
  const {id, account: [username, password, region]} = props;
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    login();
  }, [id, username, password, region]);

  async function login() {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const acc = await ValorantAPI.login(username, password, region);
      setUser(acc);
    } catch (err) {
      setLoading(false);
    }
  }

  return (
    <div className="account">
      <Store id={id} user={user}/>
    </div>
  );
}

Account.propTypes = {
  id: PropTypes.number.isRequired,
  account: PropTypes.array.isRequired,
};

export default Account;
