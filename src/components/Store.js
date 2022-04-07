import React, {
  useEffect,
  useState,
  useRef,
  useReducer,
  useContext,
} from "react";
import PropTypes from "prop-types";
import ValorantAPI from "../util/ValorantAPI";
import Item from "./Item";
import BonusItem from "./BonusItem";
import CurrencyIcon from "./CurrencyIcon";
import Loader from "./Loader";
import "./Store.css";
import useAccountStorage from "../util/useAccountStorage";
import { AccountsContext } from "../contexts/accounts.context";

function Store(props) {
  const { id, user } = props;
  const { accounts, setAccounts } = useContext(AccountsContext);
  const [loading, setLoading] = useState(true);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [, setBundle] = useState(null);
  const [vp, setVP] = useState(0);
  const [rp, setRP] = useState(0);
  const [items, setItems] = useState(null);
  const [bonusItems, setBonusItems] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [storeUpdateMarker, updateStore] = useReducer((n) => n + 1, 0);
  const [accountStorage, setAccountStorage] = useAccountStorage();
  const refreshTime = useRef(null);
  const timer = useRef(null);

  document.refreshTime = refreshTime;
  document.setLoading = setLoading;

  useEffect(() => {
    const key = `${user.region}#${user.username}`;

    function currentTime() {
      return new Date().getTime() / 1000;
    }

    function updateTimeLeft() {
      const newTimeLeft = refreshTime.current - currentTime();
      if (newTimeLeft <= 0) {
        clearInterval(timer.current);
        timer.current = null;
        setTimeout(updateStore, 500);
      } else {
        setTimeLeft(newTimeLeft);
      }
    }

    function parseData(data) {
      console.log(data);
      setBundle({
        id: data.FeaturedBundle.Bundle.ID,
        items: data.FeaturedBundle.Items,
      });
      setItems(data.SkinsPanelLayout.SingleItemOffers);

      var bItems = data.BonusStore.BonusStoreOffers.map(function (item) {
        return item.Offer.OfferID;
      });
      setBonusItems(data.BonusStore.BonusStoreOffers);

      const secondsLeft =
        data.SkinsPanelLayout.SingleItemOffersRemainingDurationInSeconds;
      refreshTime.current = Math.floor(currentTime() + secondsLeft);

      updateTimeLeft();

      if (timer.current !== undefined && timer.current !== null) {
        clearInterval(timer.current);
      }

      timer.current = setInterval(updateTimeLeft, 1000);
    }

    function parseWalletData(data) {
      setVP(data.Balances[ValorantAPI.CURRENCIES.VP]);
      setRP(data.Balances[ValorantAPI.CURRENCIES.RP]);
    }

    setLoading(true);
    setBundle(null);
    setItems(null);
    setBonusItems(null);
    const authHeaders = {
      Authorization: `Bearer ${user.accessToken}`,
      "X-Riot-Entitlements-JWT": user.entitlementsToken,
    };

    async function getWallet() {
      const res = await ValorantAPI.request(
        key,
        "GET",
        ValorantAPI.url("wallet", user.region, user.userID),
        authHeaders
      );
      parseWalletData(res.data);
      setLoadingWallet(false);
    }
    async function getShop() {
      const res = await ValorantAPI.request(
        key,
        "GET",
        ValorantAPI.url("storefront", user.region, user.userID),
        authHeaders
      );
      parseData(res.data);
      setLoading(false);
    }
    getWallet();
    getShop();
    return () => {
      if (timer.current !== undefined && timer.current !== null) {
        clearInterval(timer.current);
      }
    };
  }, [user, storeUpdateMarker]);

  function parseTime(seconds) {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  }

  function removeAccount() {
    const newAccountStorage = accountStorage.slice();
    newAccountStorage.splice(id, 1);
    setAccountStorage(newAccountStorage);
    setAccounts(newAccountStorage);
  }

  return (
    <div>
      {loading || loadingWallet ? (
        <div className="store column item card">
          <div className="item card-content">
            <Loader className="is-centered" />
          </div>
        </div>
      ) : (
        <div>
          {/* <div><img src={`https://media.valorant-api.com/bundles/${bundle.id}/displayicon.png`} /></div> */}
          <div className="columns items is-gapless">
            <div className="column store top-text">
              <div className="vertical-align-children">
                <span className="store riot-id">{user.riotID}</span>
                <span>
                  <CurrencyIcon
                    id={ValorantAPI.CURRENCIES.VP}
                    alt="VALORANT points"
                  />
                  <span> {vp} </span>
                  <CurrencyIcon
                    id={ValorantAPI.CURRENCIES.RP}
                    alt="Radianite points"
                  />
                  <span> {rp} </span>
                </span>
                <span>{parseTime(timeLeft)} </span>
                <button className="button is-small" onClick={removeAccount}>
                  Remove
                </button>
              </div>
            </div>
            {items.map((item) => (
              <Item key={item} id={item} />
            ))}
          </div>

          {bonusItems ? (
            <div className="columns items is-gapless bonus-items">
              {bonusItems &&
                bonusItems.map((item) => <BonusItem key={item.Offer.OfferID} item={item} />)}
            </div>
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
}

Store.propTypes = {
  id: PropTypes.number.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    region: PropTypes.string.isRequired,
    accessToken: PropTypes.string.isRequired,
    idToken: PropTypes.string.isRequired,
    expiresIn: PropTypes.number.isRequired,
    entitlementsToken: PropTypes.string.isRequired,
    userID: PropTypes.string.isRequired,
    riotID: PropTypes.string.isRequired,
  }).isRequired,
};

export default Store;
