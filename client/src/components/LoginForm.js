import React from 'react';
import { connect } from 'react-redux'

import CustomReduxForm from './CustomReduxForm';
import { loginUser } from '../actions/user'

class LoginForm extends React.Component {
  getFields() {
    return [
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        mandatory: true
      },
      {
        name: 'password',
        type: 'password',
        label: 'Password',
        mandatory: true
      }
    ];
  }

  handleFormSubmit = values => {
    const { loginUser } = this.props

    loginUser(values)
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

export default connect(null, { loginUser })(LoginForm)