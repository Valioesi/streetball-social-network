import React, { Component } from 'react';
import { View, Button, StyleSheet, FlatList, AsyncStorage, Text } from 'react-native';
import CONFIG from './../config.js';
import moment from 'moment';

export default class SessionScreen extends Component {
    static navigationOptions = {
        tabBarLabel: 'Sessions'
    }

    constructor(props) {
        super(props);
        this.state = {
            sessions: []
        }
        this.goToAddSessionScreen = this.goToAddSessionScreen.bind(this);
    }

    componentDidMount() {
        this.fetchSessions();
    }

    //make api request to get all sessions
    fetchSessions() {
        //TODO: all sessions are fetched, in the future we only want sessions of friends
        AsyncStorage.getItem('token').then((token) => {
            fetch(CONFIG.SERVER_URL + '/sessions', {
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
                        this.setState({ sessions: response.sessions });
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }).catch((error) => {
            console.log(error);
        });
    }

    goToAddSessionScreen() {
        //pass a parameter function that is called in AddSessionScreen to reload the sessions
        this.props.navigation.navigate('AddSession', {
            reloadSessions: () => {
                this.fetchSessions();
            }
        });
    }

    render() {
        console.log('State SessionScreen: ', this.state);
        return (
            <View style={styles.container}>
                <Button title='New session' onPress={this.goToAddSessionScreen} />
                <FlatList
                    data={this.state.sessions}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <Text style={styles.itemText}>{moment(item.time).format('LLLL')}</Text>
                            <Text style={styles.itemText}>{item.court.name}</Text>
                        </View>
                    )} />
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
})