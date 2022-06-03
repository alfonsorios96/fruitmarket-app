import React, {Component} from 'react';
import {Alert, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import * as SecureStore from 'expo-secure-store';

import LoginView from './views/LoginView';
import HomeView from './views/HomeView';

import reducers from './configureStore';
import {createStore} from 'redux';

const store = createStore(reducers);

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 'login',
            isLogged: false
        };
    }

    async componentDidMount() {
        try {
            const token = await SecureStore.getItemAsync('secure_token');
            if (token) {
                this.setState({page: 'home', isLogged: true});
            }
        } catch (e) {
            if (e) {
                Alert.alert('ERROR', `${JSON.stringify(e)}`);
            }
        }
    }

    loginSuccess(payload) {
        if(payload.error) {
            Alert.alert('Error', payload.error);
        }
        SecureStore.setItemAsync('secure_token', payload.token)
            .then(() => {
                this.setState({page: 'home', isLogged: true});
            })
            .catch(error => {
                Alert.alert('ERROR', JSON.stringify(error));
            });
    }

    loginError(error) {
        Alert.alert('Error', error.message);
    }

    async logout() {
        await SecureStore.deleteItemAsync('secure_token');
        this.setState({page: 'login', isLogged: false});
    }

    onVisit() {
        this.setState({page: 'home', isLogged: false});
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    {this.state.page === 'login' && (
                        <LoginView
                            loginSuccess={this.loginSuccess.bind(this)}
                            loginError={this.loginError.bind(this)}
                            isLogged={this.state.isLogged}
                            onVisit={this.onVisit.bind(this)}
                        ></LoginView>
                    )}
                    {this.state.page === 'home' && (
                        <HomeView store={store}
                                  isLogged={this.state.isLogged}
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
