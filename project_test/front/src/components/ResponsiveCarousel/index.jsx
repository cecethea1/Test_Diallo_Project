import React from 'react';
import PropTypes from 'prop-types';
import { Paper } from '@material-ui/core';
import CustomSlider from '../Shared/CustomSlider';

export default function ResponsiveCarousel({ project, ...props }) {
  let { photos } = project;
  if (!photos) {
    photos = [{ url: '/images/placeholder-600x400.png', name: 'N/D' }];
  }
  return (
    <Paper elevation={2}><CustomSlider {...props} screens={photos} /></Paper>
  );
}

ResponsiveCarousel.propTypes = {
  project: PropTypes.objectOf(PropTypes.any),
};
ResponsiveCarousel.defaultProps = {
  project: {
    photos: [{ url: '/images/placeholder-600x400.png', name: 'N/D' }],
  },
};
