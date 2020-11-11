import React from 'react';
import api from '../../store/api';
import {Formik, Form, Field, useField} from 'formik';
import {TextField, Button} from '@material-ui/core';
// import {DropzoneArea} from 'material-ui-dropzone'
import './style.scss';

const MyTextField = ({label,id, ...props}) => {
  const [field] = useField(props)
  return (
    <TextField {...field} id="standard-basic" label={label} fullWidth/>
  )
}

const MyDescription = ({label, ...props}) => {
  const [field] = useField(props)
  return (
    <TextField
    {...field}
    id="outlined-multiline-static"
    label={label}
    multiline
    rows={4}
    variant="outlined"
    fullWidth
  />
  )
}

const createProject = async (values) => {
  try {
    const res = await api.post('/insert/project', {...values});
    if (res.status === 200) {
      console.log(res.data)
    } else {
      throw (new Error('Data error'));
    }
  } catch (err) {
    console.log(err);
  }
};

function createNewProject() {
  return (
    <div className="wrapper">
      <div className="section-1">
        <h1> Your New Project</h1>
      </div>
      <div className="section-2">
        <Formik
        initialValues={{
          projectName: "", 
          country: "", 
          clientCompanyName: "", 
          timeZone: "", 
          city: "", 
          startDate: "",
          projectDescription: "",
          projectPhoto: null}}
        onSubmit={(values) => {
          createProject(values)
        }}
        // validationSchema={{}}
        >
          {
            ({values}) => (
              <Form>
                <div className="formMain">
                  <div className="draAnddropimage">
                    <Field name="projectPhoto" type="file" />
                  </div>
                  <div className="formContent">
                    <div className="Left">
                      <div className="step1">
                        <MyTextField name="projectName" type="text" label="Project Name"/>
                      </div>
                      <div className="step2">
                        <MyTextField name="country" type="text" label="Country" />
                      </div>
                      <div className="step3">
                        <MyTextField name="clientCompanyName" type="text" label="Client Company Name" />
                      </div>
                    </div>
                    <div className="Right">
                      <div className="step4">
                        <MyTextField name="timeZone" type="text" label="Time Zone"/>
                      </div>
                      <div className="step5">
                        <MyTextField name="city" type="text" label="City" />
                      </div>
                      <div className="step6">
                        <MyTextField name="startDate" type="date" label="Start Date" />
                      </div>
                    </div>
                  </div>
                  <div className="description">
                      <MyDescription name="projectDescription" type="text" label="Project Description" />
                  </div>
                  <div className="savebutton">
                    <Button type="submit" variant="contained" color="primary"> Save </Button>
                  </div>
                </div>
              </Form>
            )
          }
        </Formik>
      </div>
    </div>
  )
}

export default createNewProject;