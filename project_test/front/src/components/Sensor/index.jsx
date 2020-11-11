import React, { useState } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  CircularProgress,
  Typography,
} from '@material-ui/core';
import { Formik, Form } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import Step1Form from './Forms/step1/step1';
// eslint-disable-next-line import/no-named-as-default-member
import Step2Form from './Forms/step2/step2';
import validationSchema from './FormModel/validationSchema';
import checkoutFormModel from './FormModel/sensorFormModel';
import formInitialValues from './FormModel/formInitialValues';
import './styles.scss';
import { SET_FORM_VALUES } from '../../store/sensor/actions';

const steps = ['', '', '', ''];
const { formId, formField } = checkoutFormModel;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  stepper: {
    backgroundColor: 'transparent',
  },
}));

// eslint-disable-next-line no-underscore-dangle
function renderStepContent(step) {
  switch (step) {
    case 0:
      return <Step1Form formField={formField} />;
    case 1:
      return <Step2Form formField={formField} />;
    case 2:
      return ('Step3 position');
    case 3:
      return ('Step4 position');
    default:
      return <div>Not Found</div>;
  }
}

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(0);
  const currentValidationSchema = validationSchema[activeStep];
  const dispatch = useDispatch();
  const isLastStep = activeStep === steps.length - 1;
  const classes = useStyles();

  // eslint-disable-next-line no-underscore-dangle
  function _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // eslint-disable-next-line no-underscore-dangle
  async function _submitForm(_values, actions) {
    await _sleep(1000);
    actions.setSubmitting(false);
    setActiveStep(activeStep + 1);
  }

  function handleSubmit(values, actions) {
    console.log('%c%s', 'color: #00b300', { currentValidationSchema });
    dispatch({ type: SET_FORM_VALUES, payload: values });
    if (isLastStep) {
      alert(JSON.stringify(values, null, 2));
      _submitForm(values, actions);
    } else {
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  }

  function handleBack() {
    setActiveStep(activeStep - 1);
  }

  return (
    <div className="container">
      <div className="item_1">
        <Typography variant="h4" component="h2">
          Add Sensor
        </Typography>
      </div>
      <div className="item_2">
        {
          activeStep === steps.length ? (<h4> Sucess </h4>) : (
            <div className="container_formik">
              <Formik
                initialValues={formInitialValues}
                // validationSchema={currentValidationSchema}
                onSubmit={handleSubmit}
              >
                {
                  ({ isSubmitting }) => (
                    <div className="container_form">
                      <Form id={formId}>
                        <div className="container_formValue">
                          {renderStepContent(activeStep)}
                        </div>
                        <div className="container_bottom">
                          <div className="container_stepper">
                            <Stepper activeStep={activeStep} className={classes.stepper}>
                              {steps.map((label, key) => (
                                <Step key={key.toString()}>
                                  <StepLabel>{label}</StepLabel>
                                </Step>
                              ))}
                            </Stepper>
                          </div>
                          <div className="container_buttom">
                            <div className="container_button_back">
                              {
                                activeStep !== 0 && (
                                  <Button
                                    variant="contained"
                                    className="pull-rigth"
                                    onClick={handleBack}
                                  >
                                    Back
                                  </Button>
                                )
                              }
                            </div>
                            <div className="container_button_next">
                              <Button
                                disabled={isSubmitting}
                                type="submit"
                                variant="contained"
                                color="primary"
                                className="pull-rigth"
                              >
                                {isLastStep ? 'Submit' : 'Next'}
                              </Button>
                              {isSubmitting && (
                                <CircularProgress
                                  size={24}
                                  aligncontent="left"
                                  className="buttonProgress"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </Form>
                    </div>
                  )
                }
              </Formik>
            </div>
          )
        }
      </div>
    </div>
  );
}
