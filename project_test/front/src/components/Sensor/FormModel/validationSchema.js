import * as Yup from 'yup';
import moment from 'moment';
import sensorFormModel from './sensorFormModel';

const {
  formField: {
    gatewayName,
    serialNumber,
    projectName,
    transferProtocol,
    powerSupply,
    installationDate,
    operatingTeam,
    IPI,
    Theodolite,
    Stainmeter,
    Piezometer,
    Pressuremeter,
    Tiltlog,
    Crackmeter,
    LoadCells,
  },
} = sensorFormModel;


// const visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;

export default [
  Yup.object().shape({
    [gatewayName.name]: Yup.string().required(`${gatewayName.requiredErrorMsg}`),
    [serialNumber.name]: Yup.string().required(`${serialNumber.requiredErrorMsg}`),
    [projectName.name]: Yup.string().required(`${projectName.requiredErrorMsg}`),
    [transferProtocol.name]: Yup.string().required(`${transferProtocol.requiredErrorMsg}`),
    [powerSupply.name]: Yup.string().required(`${powerSupply.requiredErrorMsg}`),
    [installationDate.name]: Yup.string()
      .nullable()
      .required(`${installationDate.requiredErrorMsg}`)


      .test('expDate', installationDate.invalidErrorMsg, (val) => {
        if (val) {
          const startDate = new Date();
          const endDate = new Date(2050, 12, 31);
          if (moment(val, moment.ISO_8601).isValid()) {
            return moment(val).isBetween(startDate, endDate);
          }
          return false;
        }
        return false;
      }),

    [operatingTeam.name]: Yup.string().required(`${powerSupply.requiredErrorMsg}`),
    [IPI.name]: Yup.number().min(0).max(10).integer(),
    [Theodolite.name]: Yup.number().required().min(0).max(10)
      .integer(),
    [Stainmeter.name]: Yup.number().required().min(0).max(10)
      .integer(),
    [Piezometer.name]: Yup.number().required().min(0).max(10)
      .integer(),
    [Pressuremeter.name]: Yup.number().required().min(0).max(10)
      .integer(),
    [Tiltlog.name]: Yup.number().required().min(0).max(10)
      .integer(),
    [Crackmeter.name]: Yup.number().required().min(0).max(10)
      .integer(),
    [LoadCells.name]: Yup.number().required().min(0).max(10)
      .integer(),
  }),
];
