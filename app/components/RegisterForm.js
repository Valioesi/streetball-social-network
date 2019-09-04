import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import CONFIG from './../config.js';


export default class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            errorMessage: ''
        }
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }
    //called upon click of "Login"
    handleLogin() {
        //call function of parent component (App), where the state is changed
        this.props.switchToLogin();
    }
    //called upon click of register button, makes call to api
    handleRegister() {
        //check if fields are filled
        if (this.state.email === '' || this.state.password === '' || this.state.passwordConfirmation === '') {
            this.setState({ errorMessage: 'Please fill out all the fields' });
        } else if (this.state.password !== this.state.passwordConfirmation) { //check if passwords are equal
            this.setState({ errorMessage: 'Passwords do not match' });
        } else {  
            //otherwise make a call to register endpoint of api
            fetch(CONFIG.SERVER_URL + '/users/register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.state.username,
                    email: this.state.email,
                    password: this.state.password
                })
            })
                .then((response) => response.json())
                .then((response) => {
                    //show error message 
                    if (!response.success) {
                        this.setState({ errorMessage: response.message });
                    } else {  //TODO: handle response and navigation to login
                        this.setState({ errorMessage: response.message });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }
    render() {
        return (
            <View>
                <Text style={styles.title} >Register</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({ username: text })}
                    value={this.state.username}
                    placeholder='Enter your username'
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({ email: text })}
                    value={this.state.email}
                    placeholder='Enter your email address'
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({ password: text })}
                    value={this.state.password}
                    placeholder='Enter your password'
                    secureTextEntry={true}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({ passwordConfirmation: text })}
                    value={this.state.passwordConfirmation}
                    placeholder='Confirm your password'
                    secureTextEntry={true}
                />
                <Button title='Register' onPress={this.handleRegister} />
                <Text style={styles.link} onPress={this.handleLogin}>Login</Text>
                <Text style={styles.error}>{this.state.errorMessage}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        height: 60,
        width: 250,
        paddingLeft: 10
    },
    link: {
        color: '#4752C2',
        fontSize: 16,
        marginTop: 20
    },
    title: {
        fontSize: 19,
        fontWeight: 'bold'
    },
    error: {
        color: '#993833'
    }
});  