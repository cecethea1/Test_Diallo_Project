import React, {
  useCallback, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Responsive, WidthProvider } from 'react-grid-layout';
import DashboardComponents from '../DashboardComponents';
import { SET_CURRENT_BREAKPOINT, UPDATE_ADD_LAYOUTS } from '../../../store/dashboard/actions';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const Layout = (props) => {
  const { project, className } = props;
  const {
    currentBreakpoint, addLayouts,
  } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();
  const [compactType] = useState('vertical');
  const [size, setSize] = useState();

  const onLayoutChange = (_currentLayout, allLayouts) => dispatch({ type: UPDATE_ADD_LAYOUTS, payload: allLayouts });

  const onBreakpointChange = (newBreakpoint) => {
    dispatch({ type: SET_CURRENT_BREAKPOINT, payload: newBreakpoint });
  };

  const generateDOM = useCallback(() => {
    if (currentBreakpoint) {
      const currentLayout = addLayouts[currentBreakpoint];
      if (currentLayout) {
        return (
          currentLayout.map((c) => (
            <div key={c.i} className={className}>
              <DashboardComponents
                component={c}
                className="child"
                key={c.i}
                size={size}
                editMode
                project={project}
              />
            </div>
          ))
        );
      }
    }
    return <div />;
  }, [project, addLayouts, currentBreakpoint, className]);


  return (
    <ResponsiveReactGridLayout
      {...props}
      layouts={addLayouts}
      onResize={(e) => setSize(e)}
      onLayoutChange={onLayoutChange}
      onBreakpointChange={onBreakpointChange}
      compactType={compactType}
      preventCollision={!compactType}
    >
      {generateDOM()}
    </ResponsiveReactGridLayout>
  );
};

Layout.propTypes = {
  className: PropTypes.string,
  rowHeight: PropTypes.number,
  breakpoints: PropTypes.objectOf(PropTypes.any),
  cols: PropTypes.objectOf(PropTypes.any),
  project: PropTypes.objectOf(PropTypes.any),
  isDraggable: PropTypes.bool,
  isResizable: PropTypes.bool,
};
Layout.defaultProps = {
  className: 'layout',
  rowHeight: 1,
  breakpoints: {
    lg: 1200, xxs: 0,
  },
  cols: {
    lg: 12, xxs: 1,
  },
  project: undefined,
  isDraggable: false,
  isResizable: false,
};
export default Layout;
