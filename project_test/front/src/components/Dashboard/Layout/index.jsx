import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import DashboardComponents from '../../AddDashboard/DashboardComponents';
import { SET_CURRENT_BREAKPOINT, UPDATE_LAYOUTS } from '../../../store/dashboard/actions';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const DashboardLayout = (props) => {
  const { project, layouts } = props;
  const { currentBreakpoint } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();
  const [compactType] = useState('vertical');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(() => (true));
  }, []);

  const onBreakpointChange = (newBreakpoint) => {
    dispatch({ type: SET_CURRENT_BREAKPOINT, payload: newBreakpoint });
  };
  const onLayoutChange = (_currentLayout, allLayouts) => {
    dispatch({ type: UPDATE_LAYOUTS, payload: allLayouts });
  };

  const generateDOM = useCallback(() => (!layouts[currentBreakpoint] ? (
    <div />
  ) : layouts[currentBreakpoint].map((c) => (
    <div key={c.i}>
      <DashboardComponents play component={c} className="child" key={c.i} project={project} />
    </div>
  ))), [project, layouts, currentBreakpoint]);


  return (
    <ResponsiveReactGridLayout
      {...props}
      layouts={layouts}
      onLayoutChange={onLayoutChange}
      onBreakpointChange={onBreakpointChange}
      // WidthProvider option
      measureBeforeMount={false}
      // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
      // and set `measureBeforeMount={true}`.
      useCSSTransforms={mounted}
      compactType={compactType}
      preventCollision={!compactType}
    >
      {layouts && currentBreakpoint && generateDOM()}
    </ResponsiveReactGridLayout>
  );
};

DashboardLayout.propTypes = {
  className: PropTypes.string,
  rowHeight: PropTypes.number,
  breakpoints: PropTypes.objectOf(PropTypes.any),
  cols: PropTypes.objectOf(PropTypes.any),
  project: PropTypes.objectOf(PropTypes.any),
  selectedComponents: PropTypes.arrayOf(PropTypes.any),
  layouts: PropTypes.objectOf(PropTypes.any).isRequired,
  isDraggable: PropTypes.bool,
  isResizable: PropTypes.bool,
};
DashboardLayout.defaultProps = {
  className: 'layout',
  rowHeight: 1,
  breakpoints: {
    lg: 1200, xxs: 0,
  },
  cols: {
    lg: 12, xxs: 1,
  },
  selectedComponents: null,
  project: undefined,
  isDraggable: false,
  isResizable: false,
};
export default DashboardLayout;
