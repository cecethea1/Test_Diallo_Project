import React, { forwardRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

const SearchInput = forwardRef(({
  placeholder, inputProps, withMenu, withSubmit, onSubmit, onChange,
}, ref) => {
  const classes = useStyles();

  return (
    <Paper component="form" className={classes.root}>
      {withMenu && (
        <IconButton className={classes.iconButton} aria-label="menu">
          <MenuIcon />
        </IconButton>
      )}
      <InputBase
        ref={ref}
        onChange={onChange}
        fullWidth
        className={classes.input}
        placeholder={placeholder}
        inputProps={inputProps}
      />
      <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
      {withSubmit && (
        <>
          <Divider className={classes.divider} orientation="vertical" />
          <IconButton color="primary" className={classes.iconButton} onClick={onSubmit} aria-label="directions">
            <DirectionsIcon />
          </IconButton>
        </>
      )}
    </Paper>
  );
});

SearchInput.propTypes = {
  placeholder: PropTypes.string,
  inputProps: PropTypes.objectOf(PropTypes.any),
  withSubmit: PropTypes.bool,
  withMenu: PropTypes.bool,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
};

SearchInput.defaultProps = {
  placeholder: 'Search ...',
  inputProps: { 'aria-label': 'search ...' },
  withSubmit: false,
  withMenu: false,
  onSubmit: () => { },
  onChange: () => { },
};

export default SearchInput;
