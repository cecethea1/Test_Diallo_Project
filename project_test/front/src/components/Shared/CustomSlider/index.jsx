import React from 'react';
import AwesomeSlider from 'react-awesome-slider';
import PropTypes from 'prop-types';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import AwsSliderStyles from './style.scss';


const AutoplaySlider = withAutoplay(AwesomeSlider);

const CustomSlider = ({ screens, play }) => (
  <AutoplaySlider interval={1500} play={play} cssModule={AwsSliderStyles}>
    {screens.map(({ url, name }) => (
      <div key={url} data-src={url}>
        <p>{name}</p>
      </div>
    ))}
  </AutoplaySlider>
);

CustomSlider.propTypes = {
  screens: PropTypes.arrayOf(PropTypes.any).isRequired,
  play: PropTypes.bool,
};
CustomSlider.defaultProps = {
  play: false,
};
export default CustomSlider;
