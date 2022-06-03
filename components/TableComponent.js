import React, {Component} from 'react';
import {View, Text, Button, StyleSheet, Modal, TextInput, Alert} from 'react-native';
import {Collapse, CollapseHeader, CollapseBody} from 'accordion-collapse-react-native';
import RNPickerSelect from 'react-native-picker-select';
import * as SecureStore from 'expo-secure-store';

// import {HOST} from '@env';
import {transferFruit} from "../actions/stores";

export default class TableComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            storeSelected: {},
            fruitSelected: {},
            modalVisible: false,
            storeFrom: '',
            stores: [],
            quantity: '0'
        };
    }

    componentDidMount() {
        const {store} = this.props;
        this.setState({stores: [...store.getState().stores]});
    }

    onShowTransferModal(store, fruit) {
        this.setState({storeSelected: store, fruitSelected: fruit});
        this.setModalVisible(!this.state.modalVisible);
    }

    setModalVisible = (visible) => {
        this.setState({modalVisible: visible});
    }

    async onTransfer() {
        const {store} = this.props;
        const {fruitSelected: fruit, storeSelected, quantity, storeTo} = this.state;
        this.setModalVisible(false);
        const token = await SecureStore.getItemAsync('secure_token');
        try {
            const response = await fetch(`http://localhost:3004/fruit/transfer/${fruit._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    quantity: Number(quantity),
                    from: storeSelected._id,
                    to: storeTo,
                })
            });
            const {data} = await response.json();
            if (data) {
                store.dispatch(transferFruit(storeSelected._id, storeTo, fruit._id, Number(quantity)));
                this.setState({stores: [...store.getState().stores]});
                Alert.alert('Success', data.message);
            }
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        const {isLogged} = this.props;

        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(!this.state.modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Transfer {this.state.fruitSelected.name}</Text>

                            <View>
                                <Text>From store {this.state.storeSelected.name}</Text>
                                <Text> ===> </Text>
                                <RNPickerSelect
                                    onValueChange={(store) => this.setState({storeTo: store})}
                                    items={this.state.stores.filter(store => store._id !== this.state.storeSelected._id).map(store => ({
                                        label: store.name,
                                        value: store._id
                                    }))}
                                />
                                <TextInput
                                    value={this.state.quantity}
                                    onChangeText={(quantity) => this.setState({quantity})}
                                    placeholder={'Quantity'}
                                    style={styles.input}
                                />
                                <Button
                                    title={'Confirm transfer'}
                                    style={styles.input}
                                    onPress={this.onTransfer.bind(this)}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
                {
                    this.state.stores.map((store, i) => {
                        return (
                            <Collapse key={`collapse-item-${i}`} style={styles.container}>
                                <CollapseHeader>
                                    <View>
                                        <Text style={styles.titleText}>{store.name} -
                                            Fruits {store.fruits.reduce((sum, fruit) => sum + fruit.stock, 0)}</Text>
                                    </View>
                                </CollapseHeader>
                                <CollapseBody>
                                    {store.fruits.map((fruit, fi) => {
                                        return (
                                            <View key={`fruit-row-${fi}`} style={styles.box}>
                                                <Text>{fruit.name} {`${fruit.stock}`}</Text>
                                                {isLogged && (
                                                    <Button
                                                        title={'Transfer'}
                                                        style={styles.input}
                                                        onPress={this.onShowTransferModal.bind(this, store, fruit)}
                                                    />
                                                )}
                                            </View>
                                        );
                                    })}
                                </CollapseBody>
                            </Collapse>
                        );
                    })
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    titleText: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center"
    },
    box: {
        borderRadius: 10,
        width: 250,
        height: 50,
        flex: 2,
        justifyContent: "between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: 'black',
    }
});