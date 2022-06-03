import React, {Component} from 'react';
import {View, StyleSheet, Button} from 'react-native';

import {HOST} from '@env';

import TableComponent from '../components/TableComponent';

export default class HomeView extends Component {

    constructor(props) {
        super(props);

        this.logout = props.logout;

        this.state = {
            stores: []
        };
    }

    async componentDidMount() {
        try {
            const response = await fetch(`${HOST}/fruit/stock`);
            const payload = await response.json();
            this.setState({stores: [...payload.data]});
        } catch (e) {
            console.log(e);
            Alert.alert('ERROR', JSON.stringify(e));
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Button
                    title={'Logout'}
                    style={styles.input}
                    onPress={this.logout.bind(this)}
                />
                <TableComponent
                    stores={this.state.stores}>
                </TableComponent>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});
