import React, { Component } from 'react';
import { View, StyleSheet, Text, Button, AsyncStorage } from 'react-native';
import CONFIG from './../config.js';

export default class ListItemUser extends Component {
    constructor(props) {
        super(props);

    }

    //api request to accept the friend request

    acceptFriendRequest(friendId) {
        //get access token from async storage
        AsyncStorage.getItem('token').then((token) => {
            //make api call to friends endpoint via put
            fetch(CONFIG.SERVER_URL + '/users/friends', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                },
                body: JSON.stringify({
                    friendId: friendId
                })
            })
                .then((response) => {console.log(response); return response.json()})
                .then((response) => {
                    if (!response.success) {
                        console.log(response.message);
                    } else {
                        console.log(response.message);
                        //use prop function to make FriendScreen refetch friends
                        this.props.reloadFriends();
                    }
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
            <View style={styles.listItem}>
                <Text style={styles.itemText}>{this.props.user.username}</Text>
                <Text style={styles.itemText}>{this.props.user.email}</Text>
                <Button
                    title='Accept request'
                    onPress={() => { this.acceptFriendRequest(this.props.user._id) }}
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