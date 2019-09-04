import React, { Component } from 'react';
import { View, AsyncStorage, FlatList, StyleSheet, Text, Button } from 'react-native';
import CONFIG from './../config.js';

export default class CourtScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courts: []
        };
        this.goToAddCourtScreen = this.goToAddCourtScreen.bind(this);
    }

    componentDidMount() {
        this.fetchCourts();
    }

    fetchCourts(){
        //get auth token from storage
        AsyncStorage.getItem('token').then((token) => {
            //make api request to fetch courts from server
            fetch(CONFIG.SERVER_URL + '/courts', {
                method: 'GET',
                headers: {
                    'x-access-token': token
                }
            })
                .then((response) => response.json())
                .then((response) => {
                    if (!response.success) {
                        console.log(response.message);
                    } else {
                        this.setState({ courts: response.courts });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }).catch((error) => {
            console.log(error);
        });
    }

    goToAddCourtScreen(){
        //pass a parameter function that is called in AddCourtScreen to reload the courts
        this.props.navigation.navigate('AddCourt', {
            reloadCourts: () => {
                this.fetchCourts();
            }
        });
    }
    render() {
        console.log('State CourtScreen: ', this.state);
        return (
            <View style={styles.container}>
                <Button title='New court' onPress={this.goToAddCourtScreen} />

                <FlatList
                    data={this.state.courts}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <Text style={styles.itemText}>{item.name}</Text>
                            <Text style={styles.itemText}>{item.city}</Text>
                        </View>
                    )}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    listItem: {
        padding: 20
    },
    itemText: {
        fontSize: 19,
        margin: 5
    }
});