import React, { Component } from 'react';
import { View, StyleSheet, Text, Button, AsyncStorage } from 'react-native';
import CONFIG from './../config.js';

export default class ListItemUser extends Component {
    constructor(props) {
        super(props);
        //we want to define friendStatus as state property so we can change it after friend request was sent
        this.state = {
            friendStatus: this.props.user.friendStatus
        }
    }

    //called upon click of button in list item, makes api call to add a friend
    addFriend(friendId) {
        //get access token from async storage
        AsyncStorage.getItem('token').then((token) => {
            if (this.state.searchInput !== '') {
                //make api call to friends endpoint 
                fetch(CONFIG.SERVER_URL + '/users/friends', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'x-access-token': token,
                    },
                    body: JSON.stringify({
                        friendId: friendId
                    })
                })
                    .then((response) => response.json())
                    .then((response) => {
                        if (!response.success) {
                            console.log(response.message);
                        } else {
                            //we want to change the button, therefore we change the state
                            this.setState({ friendStatus: 'requested' });
                            console.log(response.message);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        }).catch((error) => {
            console.log(error);
        });

    }

    render() {
        console.log('friendStatus: ' + this.state.friendStatus);
        let buttonTitle = null;
        let disableButton = null;
        if (this.state.friendStatus === 'friend') {
            buttonTitle = 'You are already friends';
            disableButton = true;
        } else if (this.state.friendStatus === 'requested') {
            buttonTitle = 'Friend request sent';
            disableButton = true;
        } else {
            buttonTitle = 'Add friend';
            disableButton = false;
        }
        return (
            <View style={styles.listItem}>
                <Text style={styles.itemText}>{this.props.user.username}</Text>
                <Text style={styles.itemText}>{this.props.user.email}</Text>
                <Button
                    title={buttonTitle}
                    onPress={() => this.addFriend(this.props.user._id)}
                    disabled={disableButton}
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