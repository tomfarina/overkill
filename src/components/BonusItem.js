import React, { useDebugValue } from "react";
import PropTypes from "prop-types";
import CurrencyIcon from "./CurrencyIcon";
import "./Item.css";
import ValorantAPI from "../util/ValorantAPI";

function BonusItem(props) {
  const { item } = props;
  const id = item.Offer.OfferID;
  const favorites = ["RGX 11Z Pro Vandal"];
  const shortName =
    ValorantAPI.names[id].length > 10
      ? ValorantAPI.names[id].substring(0, 10) + "..."
      : ValorantAPI.names[id];

  return (
    <div
      className={`bonus column item ${
        favorites.indexOf(ValorantAPI.names[id]) > -1 ? "favorite" : ""
      }`}
    >
      <div className="item card-image">
        <img
          className="skin-icon"
          src={ValorantAPI.url("skinIcon", id)}
          alt="weapon skin"
        />
      </div>
      <div className="item card-content">
        <p className="item title is-7 price vertical-align-children">
          {item.DiscountCosts['85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741']}{" "}
          <CurrencyIcon id={ValorantAPI.CURRENCIES.VP} alt="VALORANT points" /><br/>
          <span className='discount'>-{item.DiscountPercent}{"% "}</span>
        </p>
        <p className="item title is-7">{shortName}</p>
      </div>
    </div>
  );
}

// BonusItem.propTypes = {
//   id: PropTypes.string.isRequired,
// };

export default BonusItem;
