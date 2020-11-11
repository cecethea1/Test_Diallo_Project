import { createMuiTheme } from '@material-ui/core/styles';


import SourceSansPro from './fonts/SourceSansPro-Regular_04b555c039edcb600ceddf5a9aaeca9f.ttf';

const sourceSansPro = {
  fontFamily: 'Source Sans Pro',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 700,
  LineSpacing: 8,
  src: `
    local('SourceSansPro'),
    local('SourceSansPro-Regular'),
    url(${SourceSansPro}) format('ttf')
  `,
};
// A custom theme for thm
const theme = createMuiTheme({
  typography: {
    font: 'normal normal normal 15px/21px Source Sans Pro',
    letterSpacing: 0,
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [sourceSansPro],
      },
    },
  },
  palette: {
    primary: {
      light: '#0e2352',
      main: '#153376',
      dark: '#12295f',
      contrastText: '#fff',
    },
    secondary: {
      light: '#295db2',
      main: '#3B86FF',
      dark: '#629eff',
      contrastText: '#000',
    },
  },
});

export default theme;
