import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Button, AsyncStorage, Text } from 'react-native';
import MyDatePicker from './MyDatePicker.js';
import moment from 'moment';
import CONFIG from './../config.js';

export default class AddSessionScreen extends Component {
    static navigationOptions = {
        title: 'Add session'
    }

    constructor(props) {
        super(props);
        this.state = {
            court: null,
            time: moment().format(),
            errorMessage: ''
        }
        this.saveSession = this.saveSession.bind(this);
        this.goToSelectCourtScreen = this.goToSelectCourtScreen.bind(this);
    }

    //does a post request to api to save the session
    saveSession() {
        console.log('State: ', this.state);
        //only proceed if a court was selected
        if (this.state.court) {
            //delete players field in court field, because it is not needed
            delete this.state.court.players;
            //first of all get token from storage
            AsyncStorage.getItem('token').then((token) => {
                fetch(CONFIG.SERVER_URL + '/sessions', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'x-access-token': token
                    },
                    body: JSON.stringify({
                        court: this.state.court,
                        time: this.state.time
                    })
                }).
                    then((response) => response.json())
                    .then((response) => {
                        //TODO: handle response, e.g. show toast
                        console.log(response.message);
                        //call param function to reload sessions
                        this.props.navigation.state.params.reloadSessions();
                        this.props.navigation.goBack();
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }).catch((error) => {
                console.log(error);
            });
        } else {
            this.setState({ errorMessage: 'Plese select a court.' });
        }

    }

    goToSelectCourtScreen() {
        //we set a setCourt param, which can be called from the SelectCourtScreen, so that we can change the state here
        this.props.navigation.navigate('SelectCourt', {
            setCourt: (court) => {
                this.setState({ court: court });
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Button title='Select court' onPress={this.goToSelectCourtScreen} style={styles.button} />
                <Text style={styles.text}>{this.state.court ? this.state.court.name : 'No court selected'}</Text>
                <View style={styles.datepicker}>
                    <MyDatePicker
                        time={this.state.time}
                        changeTime={(time) => this.setState({ time: time })}
                    />
                </View>
                <Button title='Save' onPress={this.saveSession} />
                <Text style={[styles.text, styles.error]}>{this.state.errorMessage}</Text>

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
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        padding: 40,
    },
    datepicker: {
        margin: 10,
        flex: 0,
        alignItems: 'center'
    },
    text: {
        margin: 10,
        fontSize: 18,
        flex: 0,
        alignItems: 'center'
    },
    error: {
        color: '#993833'
    }
}); 