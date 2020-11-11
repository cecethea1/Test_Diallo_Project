/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Typography, FormControlLabel, Checkbox, Tooltip,
} from '@material-ui/core';
import { FieldArray } from 'formik';
import { unionBy } from 'lodash';
import api from '../../../../store/api';
import {
  InputField, SelectField, InputNumberField, DatePickerField,
} from '../../FormFields';
import './styles.scss';

const transferProtocols = [
  {
    value: 'HTTP',
    label: 'HTTP',
  },
  {
    value: 'FTP',
    label: 'FPT',
  },
];

export default function Step1({
  formField: {
    gatewayName,
    serialNumber,
    projectName,
    transferProtocol,
    powerSupply,
    installationDate,
    operatingTeam,
  },
}) {
  const { values: formValues } = useSelector((state) => state.sensor);
  const [sensors, setSensors] = useState();
  const [projectNames, setProjectNames] = useState([]);
  const [checkedSensors, setCheckedSensors] = useState([...formValues.checked]);

  const handleChangeChecked = (type, arrayHelpers) => {
    const index = checkedSensors.findIndex((s) => s.type === type);
    if (index > -1) {
      setCheckedSensors(checkedSensors.filter((s) => (s.type !== type)));
      arrayHelpers.remove(index);
    } else {
      setCheckedSensors([...checkedSensors, { type, count: 0 }]);
      arrayHelpers.push({ type, count: 0 });
    }
  };
  const handleChangeInput = (type, count, arrayHelpers) => {
    setCheckedSensors((c) => (unionBy([{ type, count }], c, 'type')));
    const index = checkedSensors.findIndex((s) => s.type === type);
    if (index > -1) {
      arrayHelpers.replace(index, { type, count });
    } else {
      arrayHelpers.push({ type, count });
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        if (res.status === 200) {
          const values = res.data.projects;
          const datas = values.map((val) => (
            {
              value: val.name,
              label: val.name,
            }
          ));
          setProjectNames(datas);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProjects();
  }, []);


  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const res = await api.get(`/sites/${1}/sensors`);
        if (res.status === 200) {
          setSensors(res.data);
          console.log(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSensors();
  }, []);

  return (
    <div className="wrapper">
      <div className="section">
        <div className="subsection_1">
          <div className="header_1">
            <Typography variant="h5">
              Form fields - Gateway Setup
            </Typography>
          </div>
          <div className="input_1">
            <InputField
              name={gatewayName.name}
              label={gatewayName.label}
              defaultValue={formValues.gatewayName}
              fullWidth
            />
          </div>
          <div className="input_2">
            <InputField
              name={serialNumber.name}
              label={serialNumber.label}
              defaultValue={formValues.serialNumber}
              fullWidth
            />
          </div>
          <div className="input_3">
            <SelectField
              name={projectName.name}
              label={projectName.label}
              defaultValue={formValues.projectName}
              data={projectNames}
              fullWidth
            />
          </div>
          <div className="input_4">
            <SelectField
              name={transferProtocol.name}
              label={transferProtocol.label}
              defaultValue={formValues.transferProtocol}
              data={transferProtocols}
              fullWidth
              border={1}
            />
          </div>
          <div className="input_5">
            <InputField
              name={powerSupply.name}
              label={powerSupply.label}
              defaultValue={formValues.powerSupply}
              fullWidth
            />
          </div>
          <div className="input_6">
            <DatePickerField
              name={installationDate.name}
              label={installationDate.label}
              defaultValue={formValues.installationDate}
              margin="normal"
              id="date-picker-dialog"
              format="MM/dd/yyyy"
              minDate={new Date()}
              maxDate={new Date('2050/12/31')}
              fullWidth
            />
          </div>
          <div className="input_7">
            <InputField
              name={operatingTeam.name}
              label={operatingTeam.label}
              defaultValue={formValues.operatingTeam}
              fullWidth
            />
          </div>
        </div>
        <div className="subsection_2">
          <div className="header_2">
            <Typography variant="h5">
              List of Sensor
            </Typography>
            <Typography variant="h6">
              <em> Select or add your Sensor </em>
            </Typography>
          </div>
          <div>
            <FieldArray
              name="checked"
              render={(arrayHelpers) => (
                <div>
                  {sensors && sensors.map((val) => (
                    <CheckBoxInput
                      key={val.id}
                      sensor={val}
                      checkedSensors={checkedSensors}
                      arrayHelpers={arrayHelpers}
                      onCheckedChange={handleChangeChecked}
                      onInputChange={handleChangeInput}
                    />
                  ))}
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


const CheckBoxInput = ({
  sensor, onCheckedChange, onInputChange, checkedSensors, arrayHelpers,
}) => {
  const defaultCount = checkedSensors.find((s) => (s.type === sensor.type_name)) ? Number(checkedSensors.find((s) => (s.type === sensor.type_name)).count) : undefined;
  const [count, setCount] = useState(defaultCount);

  const handleInputChange = (e) => {
    setCount(e.target.value);
    onInputChange(sensor.type_name, e.target.value, arrayHelpers);
  };
  return (
    <div className="formRight" key={sensor.id}>
      <div className="section_1">
        <FormControlLabel
          control={(
            <Tooltip title={(
              <>
                <Typography color="inherit">{sensor.type_description}</Typography>
              </>
            )}
            >
              <Checkbox
                value={sensor.type_name}
                name={sensor.type_name}
                checked={!!checkedSensors.find((s) => (s.type === sensor.type_name))}
                color="primary"
                onChange={() => onCheckedChange(sensor.type_name, arrayHelpers)}
              />
            </Tooltip>
          )}
          label={sensor.type_name}
        />
      </div>
      <div className="section_2">
        <InputNumberField
          fullWidth
          disabled={!checkedSensors.find((s) => (s.type === sensor.type_name))}
          onChange={handleInputChange}
          value={count}
          name={`${sensor.type_name}`}
          // label={sensor.type_name}
        />
      </div>
    </div>
  );
};
