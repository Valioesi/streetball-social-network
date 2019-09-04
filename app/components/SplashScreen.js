import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default class SplashScreen extends Component {
    render() {
        console.log('SplashScreen rendered');
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Loading App...</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F64747',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'bold'
    }
});
