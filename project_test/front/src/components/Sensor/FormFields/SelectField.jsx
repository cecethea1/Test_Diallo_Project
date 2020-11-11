/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { at } from 'lodash';
import { useField } from 'formik';
import {
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
} from '@material-ui/core';

function SelectField(props) {
  const { label, data, ...rest } = props;
  const [field, meta] = useField(props);
  const { value: selectedValue } = field;
  const [touched, error] = at(meta, 'touched', 'error');
  const isError = touched && error && true;
  function renderHelperText() {
    if (isError) {
      return <FormHelperText>{error}</FormHelperText>;
    }
    return null;
  }

  return (
    <FormControl {...rest} error={isError}>
      <InputLabel>{label}</InputLabel>
      <Select {...field} value={selectedValue || ''}>
        {data.map((item) => (
          <MenuItem key={item.label} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
      {renderHelperText()}
    </FormControl>
  );
}

SelectField.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
};

SelectField.defaultProps = {
  data: [],
};

export default SelectField;
