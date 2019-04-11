import React from 'react';
import CustomReduxForm from './CustomReduxForm';

class LoginForm extends React.Component {
  getFields() {
    return [
      {
        name : 'email',
        type : 'email',
        label : 'Email',
        mandatory : true
      },
      {
        name : 'password',
        type : 'password',
        label : 'Password',
        mandatory : true
      }
    ];
  }

  handleFormSubmit(values) {
    console.log(values)
  }

  render() {
    return (
      <div>
        <div>Login</div>
        <CustomReduxForm
          formName="LoginForm"
          fields={this.getFields()}
          onSubmit={this.handleFormSubmit}
        />
      </div>
    );
  }
}

export default LoginForm;