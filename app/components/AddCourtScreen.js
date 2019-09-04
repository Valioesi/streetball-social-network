import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Button, AsyncStorage, Picker } from 'react-native';
import CONFIG from './../config.js';

export default class AddSessionScreen extends Component {
    static navigationOptions = {
        title: 'Add court'
    }

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            city: '',
            address: '',
            baskets: ''
        }
        this.saveCourt = this.saveCourt.bind(this);
    }


    //does a post request to api to save the court
    saveCourt() {
        console.log('State: ', this.state);
        //first of all get token from storage
        AsyncStorage.getItem('token').then((token) => {
            fetch(CONFIG.SERVER_URL + '/courts', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({
                    name: this.state.name,
                    city: this.state.city,
                    address: this.state.address,
                    baskets: this.state.baskets
                })
            }).
                then((response) => response.json())
                .then((response) => {
                    //TODO: handle response, e.g. show toast
                    console.log(response.message);
                    //call the function that was set as parameter so that the courts are reloaded
                    this.props.navigation.state.params.reloadCourts();
                    this.props.navigation.goBack();
                })
                .catch((error) => {
                    console.log(error);
                })
        }).catch((error) => {
            console.log(error);
        });
    }


    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({ name: text })}
                    value={this.state.name}
                    placeholder="Enter the court's name"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({ city: text })}
                    value={this.state.city}
                    placeholder='Enter the city'
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({ address: text })}
                    value={this.state.address}
                    placeholder='Enter the address'
                />
                <Picker
                    selectedValue={this.state.baskets}
                    onValueChange={(itemValue, itemIndex) => this.setState({ baskets: itemValue })}
                >
                    <Picker.Item label='1 Basket' value='1' />
                    <Picker.Item label='2 Baskets' value='2' />
                    <Picker.Item label='3 Baskets' value='3' />
                    <Picker.Item label='4 Baskets' value='4' />
                    <Picker.Item label='5 Baskets' value='5' />
                    <Picker.Item label='6 Baskets' value='6' />
                    <Picker.Item label='7 Baskets' value='7' />
                    <Picker.Item label='8 Baskets' value='8' />
                </Picker>
                <Button title='Save' onPress={this.saveCourt} />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        height: 60,
        // width: 250,
        paddingLeft: 10
    },
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        // alignItems: 'center',
        padding: 40
    }
}); 
