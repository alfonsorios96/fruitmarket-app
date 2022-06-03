import React, {Component} from 'react';
import {View, StyleSheet, TextInput, Button, Text} from 'react-native';

export default class LoginView extends Component {

    constructor(props) {
        super(props);
        this.loginSuccess = props.loginSuccess;
        this.loginError = props.loginError;
        this.onVisit = props.onVisit;

        this.state = {
            username: '',
            password: '',
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.titleText}>FruitMarket</Text>

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

                <Button
                    title={'Go to Dashboard'}
                    style={styles.input}
                    onPress={this.onVisit.bind(this)}
                />
            </View>
        );
    }

    onLogin() {
        const {username, password} = this.state;
        fetch(`http://localhost:3004/login`, {
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
                if (payload.data) {
                    this.loginSuccess(payload.data);
                } else {
                    this.loginError({
                        message: payload
                    });
                }
            })
            .catch(error => {
                console.log(error);
                this.loginError({
                    stack: error,
                    message: 'Please complete the form. Try again'
                });
            });
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 200,
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
    titleText: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20
    },
});
