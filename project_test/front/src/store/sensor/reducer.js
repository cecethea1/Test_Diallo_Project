import {
  SET_FORM_VALUES, SET_TRANSFERPROTOCOL,
} from './actions';
// import api from '../api';

const initialState = {
  values: {
    gatewayName: '',
    serialNumber: '',
    projectName: '',
    transferProtocol: '',
    powerSupply: '',
    installationDate: '',
    operatingTeam: '',
    checked: [],
  },
};

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
export default function sensor(state = initialState, action) {
  switch (action.type) {
    case SET_FORM_VALUES:
      return { ...state, values: action.payload };
    case SET_TRANSFERPROTOCOL:
      return { ...transferProtocols, ...action.payload };
    default:
      return state;
  }
}
