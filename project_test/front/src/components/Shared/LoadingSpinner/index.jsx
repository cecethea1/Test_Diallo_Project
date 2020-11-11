import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

const LoadingSpinner = ({ show, text }) => (
  <div>
    <div className={`spanner ${show ? 'show' : ''}`}>
      <div className={`loader ${show ? 'show' : ''}`} />
      {text && <p>{text}</p>}
    </div>
  </div>
);

LoadingSpinner.propTypes = {
  show: PropTypes.bool,
  text: PropTypes.string,
};

LoadingSpinner.defaultProps = {
  show: false,
  text: null,
};

export default LoadingSpinner;
