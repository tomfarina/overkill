import React from 'react';
import PropTypes from 'prop-types';
import CurrencyIcon from './CurrencyIcon';
import './Item.css';
import ValorantAPI from '../util/ValorantAPI';

function Item(props) {
  const { id } = props;
  const favorites = ["RGX 11Z Pro Vandal"];
  const shortName = ValorantAPI.names[id].length > 20 ? ValorantAPI.names[id].substring(0,20) + "..." : ValorantAPI.names[id];
  
  return (
    <div className={`column item ${favorites.indexOf(ValorantAPI.names[id]) > -1 ? "favorite" : ""}`}>
      <div className="item card-image">
        <img className="skin-icon" src={ValorantAPI.url('skinIcon', id)} alt="weapon skin" />
      </div>
      <div className="item card-content">
        <p className="item title is-7 price vertical-align-children">
          {ValorantAPI.prices[id]}
          {' '}
          <CurrencyIcon id={ValorantAPI.CURRENCIES.VP} alt="VALORANT points" />
        </p>
        <p className="item title is-7">{shortName}</p>
      </div>
    </div>
  );
}

Item.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Item;
