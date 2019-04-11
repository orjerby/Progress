import React from 'react'
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default class Home extends React.Component {
    render() {
        return (
            <div>
                Home

                <LoginForm />
                <RegisterForm />
            </div>
        )
    }
}