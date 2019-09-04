import React, { Component } from 'react';
import { StyleSheet, View, AsyncStorage, Text } from 'react-native';
import LoginScreen from './components/LoginScreen.js';
import SplashScreen from './components/SplashScreen.js';
import Navigator from './components/StackNavigator.js';
import CONFIG from './config.js';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSplashScreen: true,
      isLoggedIn: false
    }
  }

  componentDidMount() {
    //make api request to check whether or not user is authenticated
    //get token from async storage
    AsyncStorage.getItem('token').then((token) => {
      //only do api request if there is a token stored
      if (token === null) {
        console.log('No token stored in AsyncStorage');
        //change state so that splash screen is not rendered anymore and login screen will be rendered
        this.setState({
          isLoggedIn: false,
          showSplashScreen: false
        });
      } else {
        fetch(CONFIG.SERVER_URL + '/users/authenticate', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: token
          })
        })
          .then((response) => response.json())
          .then((response) => {
            if (response.success) {
              //change state so that splash screen is not rendered anymore and home screen will be rendered (not login screen)
              this.setState({
                isLoggedIn: true,
                showSplashScreen: false
              });
            } else {
              //change state so that splash screen is not rendered anymore and login screen will be rendered
              this.setState({
                isLoggedIn: false,
                showSplashScreen: false
              });
              console.log(response.message);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    console.log(this.state);
    //in the beginning we only show splash screen, 
    //after having checked if user is authenticated we either show LoginScreen or HomeScreen (which is handled by Navigator)
    let content = null;
    if (this.state.showSplashScreen) {
      content = <SplashScreen />;
    } else {
      if (this.state.isLoggedIn) {
        content = <Navigator />;
      } else {
        //changeState is called when user is logged in correctly in LoginForm
        content = <LoginScreen changeState={() => this.setState({ isLoggedIn: true })} />;
      }
    }
    return (
      <View style={styles.container}>
        {content}
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 23
    }
});


