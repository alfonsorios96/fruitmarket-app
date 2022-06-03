import React, {Component} from 'react';
import {Alert, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import LoginView from './views/LoginView';
import HomeView from './views/HomeView';
import * as SecureStore from 'expo-secure-store';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 'login'
        };
    }

    async componentDidMount() {
        try {
            const token = await SecureStore.getItemAsync('secure_token');
            if(token) {
                this.setState({page: 'home'});
            }
        } catch (e) {
            if(e) {
                Alert.alert('ERROR', `${JSON.stringify(e)}`);
            }
        }
    }

    loginSuccess(payload) {
        SecureStore.setItemAsync('secure_token', payload.token)
            .then(() => {
                this.setState({page: 'home'});
            })
            .catch(error => {
                Alert.alert('ERROR', `${JSON.stringify(error)}`);
            });
    }

    loginError(error) {
        Alert.alert('Error', `${JSON.stringify(error)}`);
    }

    async logout() {
        await SecureStore.deleteItemAsync('secure_token');
        this.setState({page: 'login'});
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    {this.state.page === 'login' && (
                        <LoginView
                            loginSuccess={this.loginSuccess.bind(this)}
                            loginError={this.loginError.bind(this)}
                        ></LoginView>
                    )}
                    {this.state.page === 'home' && (
                        <HomeView
                            logout={this.logout.bind(this)}>
                        </HomeView>
                    )}
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
});
