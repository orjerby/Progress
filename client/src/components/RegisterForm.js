import React from 'react';
import { connect } from 'react-redux'

import CustomReduxForm from './CustomReduxForm';
import { registerUser } from '../actions/user'

class RegisterForm extends React.Component {
    getFields() {
        return [
            {
                name: 'name',
                type: 'text',
                label: 'Name',
                mandatory: true
            },
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

    handleFormSubmit = (values) => {
        const { registerUser } = this.props

        registerUser(values)
    }

    render() {
        return (
            <div>
                <div>Register</div>
                <CustomReduxForm
                    formName="RegisterForm"
                    fields={this.getFields()}
                    onSubmit={this.handleFormSubmit}
                />
            </div>
        );
    }
}

export default connect(null, { registerUser })(RegisterForm)