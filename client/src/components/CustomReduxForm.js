import React from 'react';
import { reduxForm, Field } from 'redux-form';

function CustomReduxForm(props) {

  class CustomForm extends React.Component {
    render() {
      const { handleSubmit, fields, onSubmit } = this.props;
      return (
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            {fields.map((myField, key) => renderFieldset(myField, key))}
            <button type="submit">Submit</button>
          </form>
        </div>
      )
    }
  }

  const renderInput = field => {
    return (
      <div>
        <input
          {...field.input}
          type={field.type}
        />

        {field.meta.touched && field.meta.error && <div>{field.meta.error}</div>}
      </div>
    );
  }

  const renderFieldset = (customField, key) => {
    return (
      <div key={key}>
        <label htmlFor={customField.name}>{customField.label}</label>
        <Field
          name={customField.name}
          component={renderInput}
          type={customField.type} />
      </div>
    );
  }

  const validate = values => {
    const errors = {}

    props.fields.forEach((customField) => {
      if (customField.mandatory && !values[customField.name]) {
        errors[customField.name] = `You must enter a valid value for ${customField.label}!`;
      }
    });

    return errors
  }

  const Wrapper = reduxForm({
    form: props.formName,
    validate
  })(CustomForm);

  return <Wrapper {...props} />

};

export default CustomReduxForm;