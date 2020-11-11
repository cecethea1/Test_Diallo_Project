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
  },
} = sensorFormModel;

export default {
  [gatewayName.name]: '',
  [serialNumber.name]: '',
  [projectName.name]: '',
  [transferProtocol.name]: '',
  [powerSupply.name]: '',
  [installationDate.name]: '',
  [operatingTeam.name]: '',
  checked: [],
  subForm: [],
};
