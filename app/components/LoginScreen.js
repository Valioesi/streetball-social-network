import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import LoginForm from './LoginForm.js';
import RegisterForm from './RegisterForm.js';

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLogin: true,
        }
    }
    render() {
        console.log('LoginScreen rendered');
        console.log(this.state);
        //depending on the state we either show login form or registration form
        return (
            <KeyboardAvoidingView style={styles.container}>
                {this.state.showLogin ? (
                    <LoginForm switchToRegister={() => this.setState({ showLogin: false })} navigateToHome={() => this.props.changeState()} />
                ) : (
                        <RegisterForm switchToLogin={() => this.setState({ showLogin: true })} />
                    )}
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});