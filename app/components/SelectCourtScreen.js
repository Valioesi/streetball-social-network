import React, { Component } from 'react';
import { View, AsyncStorage, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import CONFIG from './../config.js';

export default class SelectCourtScreen extends Component {
    static navigationOptions = {
        'title': 'Select court'
    }

    constructor(props) {
        super(props);
        this.state = {
            courts : []
        }
    }

    componentDidMount() {
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

    selectCourt(court){
        //call the function that was passed as parameter in AddSessionScreen so that the state in AddSessionScreen is updated
        this.props.navigation.state.params.setCourt(court);
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View>
                <FlatList
                    data={this.state.courts}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.listItem} onPress={() => this.selectCourt(item)}>
                            <Text style={styles.itemText}>{item.name}</Text>
                            <Text style={styles.itemText}>{item.city}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    listItem: {
        padding: 20
    },
    itemText: {
        fontSize: 19,
        margin: 5
    }
});