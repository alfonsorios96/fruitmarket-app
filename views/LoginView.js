import React, { Component } from 'react';
import {View, StyleSheet, TextInput, Button} from 'react-native';

export default class LoginView extends Component {

    constructor(props) {
        super(props);
        this.loginSuccess = props.loginSuccess;
        this.loginError = props.loginError;

        this.state = {
            username: '',
            password: '',
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    value={this.state.username}
                    onChangeText={(username) => this.setState({username})}
                    placeholder={'Username'}
                    autoCapitalize='none'
                    style={styles.input}
                />
                <TextInput
                    value={this.state.password}
                    onChangeText={(password) => this.setState({password})}
                    placeholder={'Password'}
                    secureTextEntry={true}
                    style={styles.input}
                />

                <Button
                    title={'Login'}
                    style={styles.input}
                    onPress={this.onLogin.bind(this)}
                />
            </View>
        );
    }

    onLogin() {
        const {username, password} = this.state;
        fetch(`${HOST}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username, password
            })
        })
            .then(response => response.json())
            .then(payload => {
                this.loginSuccess(payload.data);
            })
            .catch(error => {
                this.loginError(error);
            });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    input: {
        width: 200,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
    },
});
