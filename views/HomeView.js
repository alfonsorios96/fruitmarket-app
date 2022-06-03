import React, {Component} from 'react';
import {View, StyleSheet, Button} from 'react-native';
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
            const response = await fetch('http://localhost:3004/fruit/stock');
            const payload = await response.json();
            this.setState({stores: [...payload.data]});
        } catch (e) {
            console.log(e);
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
