import React, {Component} from 'react';
import {View, StyleSheet, Button, Alert} from 'react-native';

import TableComponent from '../components/TableComponent';
import {setStores} from '../actions/stores';

export default class HomeView extends Component {

    constructor(props) {
        super(props);
        this.logout = props.logout;
        this.isLogged = props.isLogged;
    }

    async componentDidMount() {
        const {store} = this.props;

        try {
            const response = await fetch(`http://localhost:3004/fruit/stock`);
            const payload = await response.json();
            store.dispatch(setStores(payload.data));
        } catch (e) {
            console.log(e);
            Alert.alert('ERROR', JSON.stringify(e));
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TableComponent store={this.props.store} isLogged={this.isLogged}>
                </TableComponent>

                <Button
                    title={this.isLogged ? 'Logout' : 'Login'}
                    style={styles.input}
                    onPress={this.logout.bind(this)}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    }
});
