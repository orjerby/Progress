import React from 'react';
import { Field, reduxForm } from 'redux-form';

class IssueForm extends React.Component {

  renderInput = ({ input, label, meta }) => {
    return (
      <div>
        <label>{label}</label>
        <input {...input} autoComplete="off" />
      </div>
    );
  };

  onSubmit = formValues => {
    this.props.onSubmit(formValues);
  }

  render() {
    return (
      <form
        onSubmit={this.props.handleSubmit(this.onSubmit)}
      >
        <Field name="name" component={this.renderInput} label="Enter name" />
        <button>Submit</button>
      </form>
    );
  }
}

const validate = formValues => {
  const errors = {};

  if (!formValues.name) {
    errors.name = 'You must enter a name';
  }

  return errors;
};

export default reduxForm({
  form: 'issueForm',
  validate
})(IssueForm);
