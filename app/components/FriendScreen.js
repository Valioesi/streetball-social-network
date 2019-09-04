import React, { Component } from 'react';
import { View, TextInput, Text, StyleSheet, AsyncStorage, FlatList } from 'react-native';
import CONFIG from './../config.js';
import ListItemUser from './ListItemUser.js';
import ListItemFriendRequest from './ListItemFriendRequest.js';

export default class FriendScreen extends Component {
    static navigationOptions = {
        tabBarLabel: 'Friends'
    }
    constructor(props) {
        super(props);
        this.state = {
            searchInput: '',
            friends: [],
            friendRequests: [],
            foundUsers: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.fetchFriends = this.fetchFriends.bind(this);
    }

    componentDidMount() {
        this.fetchFriends();
    }

    //make an api request to get friends and users, who sent friend requests
    fetchFriends() {
        //get access token from async storage
        AsyncStorage.getItem('token').then((token) => {
            fetch(CONFIG.SERVER_URL + '/users/friends', {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                }
            })
                .then((response) => response.json())
                .then((response) => {
                    if (!response.success) {
                        console.log(response.message);
                    } else {
                        console.log(response.message);
                        this.setState({
                            friends: response.friends,
                            friendRequests: response.friendRequests
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }).catch((error) => {
            console.log(error);
        });
    }

    //called upon change of text in text input to search user
    handleChange(text) {
        this.setState({ searchInput: text });
        this.searchUser();
    }
    //make an api request to find all the users matching the searchInput
    searchUser(text) {
        //get access token from async storage
        AsyncStorage.getItem('token').then((token) => {
            if (this.state.searchInput !== '') {
                //make api call to search endpoint passing the input as param
                fetch(CONFIG.SERVER_URL + '/users/search/' + this.state.searchInput, {
                    method: 'GET',
                    headers: {
                        'x-access-token': token,
                    }
                })
                    .then((response) => response.json())
                    .then((response) => {
                        if (!response.success) {
                            console.log(response.message);
                        } else {
                            console.log(response.message);
                            console.log('response: ', response);
                            this.setState({ foundUsers: response.users });
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
        console.log('FriendScreen state:', this.state);
        let searchedForUserList = null;
        let friendRequestList = null;
        let friendList = null;
        if (this.state.searchInput !== '') {
            //if there is no search input we simply show the friend list
            searchedForUserList = (
                <FlatList
                    data={this.state.foundUsers}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <ListItemUser user={item} />
                    )} />
            );
        } else {
            //otherwise we show the friend requests, if there are any, and the list of friends
            if (this.state.friendRequests.length !== 0) {
                friendRequestList = (
                    <View>
                        <Text style={styles.heading}>Friend requests</Text>
                        <FlatList
                            data={this.state.friendRequests}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <ListItemFriendRequest user={item} reloadFriends={this.fetchFriends} />
                            )} />
                    </View>
                );
            }
            friendList = (
                <View>
                    <Text style={styles.heading}>Friends</Text>
                    <FlatList
                        data={this.state.friends}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <View style={styles.listItem}>
                                <Text style={styles.itemText}>{item.username}</Text>
                                <Text style={styles.itemText}>{item.email}</Text>
                            </View>

                        )}
                    />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    onChangeText={this.handleChange}
                    value={this.state.searchInput}
                    placeholder='Search user by username'
                />
                {searchedForUserList}
                {friendRequestList}
                {friendList}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 0
    },
    input: {
        height: 60,
        paddingLeft: 10
    },
    listItem: {
        padding: 20
    },
    itemText: {
        fontSize: 19,
        margin: 5
    },
    heading: {
        marginTop: 20,
        marginLeft: 20,
        fontSize: 22,
        fontWeight: 'bold'
    }
});