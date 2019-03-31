import React from 'react';
import { Field, reduxForm } from 'redux-form';

class IssueForm extends React.Component {
  //   renderError({ error, touched }) {
  //     if (touched && error) {
  //       return (
  //         <div className="ui error message">
  //           <div className="header">{error}</div>
  //         </div>
  //       );
  //     }
  //   }

  renderInput = ({ input, label, meta }) => {
    // const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
    return (
      <div>
        <label>{label}</label>
        <input {...input} autoComplete="off" />
        {/* {this.renderError(meta)} */}
      </div>
    );
  };

  // renderPriorityRadio = ({ input, label, meta }) => {
  //   // const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
  //   return (
  //     <div>
  //       <label>{label}</label>
  //       <br />
  //       <input {...input} type="radio" name="priority" value="low" /> Low<br />
  //       <input {...input} type="radio" name="priority" value="medium" defaultChecked /> Medium<br />
  //       <input {...input} type="radio" name="priority" value="high" /> High<br />
  //     </div>
  //   )
  // }

  // renderStatusRadio = ({ input, label, meta }) => {
  //   // const className = `field ${meta.error && meta.touched ? 'error' : ''}`;
  //   return (
  //     <div>
  //       <label>{label}</label>
  //       <br />
  //       <input {...input} type="radio" name="status" value="undone" defaultChecked/> Undone<br />
  //       <input {...input} type="radio" name="status" value="progress" /> In progress<br />
  //       <input {...input} type="radio" name="status" value="done" /> Done<br />
  //     </div>
  //   )
  // }

  onSubmit = formValues => {
    this.props.onSubmit(formValues);
  }

  render() {
    return (
      <form
        onSubmit={this.props.handleSubmit(this.onSubmit)}
      >
        <Field name="description" component={this.renderInput} label="Enter description" />
        {/* <Field name="prority" component={this.renderPriorityRadio} label="Prority" />
        <Field name="status" component={this.renderStatusRadio} label="Status" /> */}
        <button>Submit</button>
      </form>
    );
  }
}

const validate = formValues => {
  const errors = {};

  if (!formValues.description) {
    errors.description = 'You must enter a description';
  }

  return errors;
};

export default reduxForm({
  form: 'issueForm',
  validate
})(IssueForm);
