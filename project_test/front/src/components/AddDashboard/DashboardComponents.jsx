import React from 'react';
import PropTypes from 'prop-types';
import Indicators from '../Indicators';
import SearchList from '../SearchList';
import ResponsiveCarousel from '../ResponsiveCarousel';
import Specifications from '../Specifications';
import ProjectDescription from '../ProjectDescription';
import QuickDetailsList from '../Alert/QuickDetailsList';
import ImagePopup from '../ImagePopup';

const components = {
  CARD_INDICATORS: Indicators,
  SEARCH_SITES: SearchList,
  IMAGE_CAROUSEL: ResponsiveCarousel,
  SPECIFICATION: Specifications,
  ALERT_QUICK_DETAILS: QuickDetailsList,
  PROJECT_DESCRIPTION: ProjectDescription,
  IMAGE_POPUP: ImagePopup,
};

function DashboardComponents({ component, ...rest }) {
  if (typeof components[component.i] !== 'undefined') {
    return React.createElement(components[component.i], { ...rest });
  }
}

DashboardComponents.propTypes = {
  component: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default DashboardComponents;
