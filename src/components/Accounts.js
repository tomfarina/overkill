import React, { useEffect, useReducer, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import "./Accounts.css";
import Account from "./Account";
import AddAccountModal from "./AddAccountModal";
import { AccountsContext } from "../contexts/accounts.context";

function Accounts(props) {
  const { accountStorage, setAccountStorage } = props;
  const { accounts, setAccounts } = useContext(AccountsContext);
  const [isModalOpen, toggleModal] = useReducer((s) => !s, false);

  useEffect(() => {
    setAccounts(accountStorage);
  }, [accountStorage]);

  const accountBlocks = useMemo(
    () =>
    accounts.map((account, idx) => (
        <Account
          key={idx}
          id={idx}
          account={account}
        />
      )),
    [accounts]
  );

  return (
    <div className="accounts-container">
      {accountBlocks.length > 0 ? accountBlocks : ""}

      <div className="add-account panel-block is-button" onClick={toggleModal}>
        Add Account
      </div>
      <AddAccountModal
        open={isModalOpen}
        toggle={toggleModal}
      />
    </div>
  );
}

Accounts.propTypes = {
  accountStorage: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
    .isRequired,
  setAccountStorage: PropTypes.func.isRequired,
};

export default Accounts;
