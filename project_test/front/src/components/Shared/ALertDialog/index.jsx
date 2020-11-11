import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';

const AlertDialog = ({
  okCullback, noCullback, agreeText, disagreeText, dialogContent, title,
}) => {
  const handleNo = () => {
    noCullback();
  };

  const handleOk = () => {
    okCullback();
  };

  return (
    <div>
      <Dialog
        open
        onClose={handleNo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"><p>{title}</p></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNo} color="primary">
            {disagreeText}
          </Button>
          <Button onClick={handleOk} color="primary" autoFocus>
            {agreeText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};


AlertDialog.propTypes = {
  okCullback: PropTypes.func,
  noCullback: PropTypes.func,
  agreeText: PropTypes.string,
  disagreeText: PropTypes.string,
  dialogContent: PropTypes.node,
  title: PropTypes.string,
};

AlertDialog.defaultProps = {
  okCullback: () => { },
  noCullback: () => { },
  agreeText: 'Agree',
  disagreeText: 'Disagree',
  dialogContent: null,
  title: '',
};

export default AlertDialog;
