/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useCallback, useState, useContext } from "react";
import PropTypes from "prop-types";
import "./AddAccountModal.css";
import ValorantAPI from "../util/ValorantAPI";
import useAccountStorage from "../util/useAccountStorage";
import { AccountsContext } from "../contexts/accounts.context";

function AddAccountModal(props) {
  const { open, toggle } = props;
  const { accounts, setAccounts } = useContext(AccountsContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("NA");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [accountStorage, setAccountStorage] = useAccountStorage();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (submitting) {
      return;
    }
    setSubmitting(true);
    try {
      const user = await ValorantAPI.login(username, password, region);
      setAccounts([...accountStorage, [username, password, region]]);
      setAccountStorage([...accountStorage, [username, password, region]]);
      
      // reset form
      setSubmitting(false);
      setUsername("");
      setPassword("");
      toggle();
    } catch (err) {
      setError("Username or password is incorrect");
      console.log(err);
      setSubmitting(false);
    }
  }

  const handleEsc = useCallback((event) => {
    if (event.keyCode === 27) {
      toggle();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleEsc, false);

    return () => {
      document.removeEventListener("keydown", handleEsc, false);
    };
  }, []);

  return (
    <div className={open ? "settings modal is-active" : "settings modal"}>
      <div className="modal-background" onClick={toggle} />
      <div className="modal-content">
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Add Account</p>
            <button
              type="button"
              onClick={toggle}
              className="delete"
              aria-label="close"
            />
          </header>
          <section className="modal-card-body">
            <div className="login">
              <div className="login-main columns">
                <div className="column">
                  <form className="login-container box" onSubmit={handleSubmit}>
                    <div className="field">
                      <label htmlFor="inputUsername" className="label">
                        Username
                        <input
                          type="text"
                          className={`input${error !== "" ? " is-danger" : ""}`}
                          value={username}
                          required
                          onChange={(e) => setUsername(e.currentTarget.value)}
                          id="inputUsername"
                        />
                      </label>
                    </div>

                    <div className="field">
                      <label htmlFor="inputPassword" className="label">
                        Password
                        <input
                          type="password"
                          className={`input${error !== "" ? " is-danger" : ""}`}
                          value={password}
                          required
                          onChange={(e) => setPassword(e.currentTarget.value)}
                          id="inputPassword"
                        />
                        <p className="help is-danger">{error}</p>
                      </label>
                    </div>

                    <label htmlFor="inputRegion" className="label">
                      Region
                      <div className="select">
                        <select
                          id="inputRegion"
                          value={region}
                          onChange={(e) => setRegion(e.currentTarget.value)}
                        >
                          <option>NA</option>
                          <option>EU</option>
                          <option>AP</option>
                          <option>KR</option>
                        </select>
                      </div>
                    </label>

                    <div className="control buttons">
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className={`button is-primary${
                          submitting ? " is-loading" : ""
                        }`}
                      >
                        Login
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
          <footer className="modal-card-foot">
            <button type="button" onClick={toggle} className="button is-dark">
              Done
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}

AddAccountModal.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  setAccounts: PropTypes.func.isRequired,
};

export default AddAccountModal;
