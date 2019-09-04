import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, AsyncStorage } from 'react-native';
import CONFIG from './../config.js';


export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMessage: ''
        }
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }
    //called upon click of "register"
    handleRegister() {
        //call function of parent component (App), where the state is changed
        this.props.switchToRegister();
    }
    //called upon click of login button, makes call to api
    handleLogin() {
        fetch(CONFIG.SERVER_URL + '/users/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
            .then((response) => response.json())
            .then((response) => {
                //show error message 
                if (!response.success) {
                    console.log('Not success logging in');
                    this.setState({ errorMessage: response.message });
                } else {  //TODO: handle response and navigation to homescreen
                    //store token in async storage
                    AsyncStorage.setItem('token', response.token).then((token) => {
                        console.log('User authenticated and token saved to async storage');
                        //change state of App.js by calling prop function of LoginScreen which in turn calls prop function of App.js
                        this.props.navigateToHome();
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
    render() {
        return (
            <View>
                <Text style={styles.title} >Login</Text>
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
                <Button title='Login' onPress={this.handleLogin} />
                <Text style={styles.link} onPress={this.handleRegister}>Register</Text>
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