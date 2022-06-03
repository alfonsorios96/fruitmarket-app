import React, {Component} from 'react';
import {View, Text, Button, StyleSheet, Modal, Pressable, TextInput, Alert} from 'react-native';
import {Collapse, CollapseHeader, CollapseBody} from 'accordion-collapse-react-native';
import RNPickerSelect from 'react-native-picker-select';
import * as SecureStore from 'expo-secure-store';

import {HOST} from '@env';

export default class TableComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            storeSelected: {},
            fruitSelected: {},
            modalVisible: false,
            storeTo: '',
            stores: [],
            quantity: '0'
        };
    }

    componentDidMount() {
        this.setState({stores: [...this.props.stores]});
    }

    onShowTransferModal(store, fruit) {
        this.setState({storeSelected: store, fruitSelected: fruit});
        this.setModalVisible(!this.state.modalVisible);
    }

    setModalVisible = (visible) => {
        this.setState({modalVisible: visible});
    }

    async onTransfer() {
        const {fruitSelected: fruit, storeSelected: store, quantity, storeTo} = this.state;
        this.setModalVisible(false);
        const token = await SecureStore.getItemAsync('secure_token');
        try {
            const response = await fetch(`${HOST}/fruit/transfer/${fruit._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    quantity: Number(quantity),
                    from: store._id,
                    to: storeTo,
                })
            });
            const {data} = await response.json();
            if (data) {
                Alert.alert('Success', data.message);
            }
        } catch (e) {
            console.log(e);
        }
    }

    render() {
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

                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => this.setModalVisible(!this.state.modalVisible)}
                            >
                                <Text style={styles.textStyle}>Hide Modal</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
                {
                    this.state.stores.map((store, i) => {
                        return (
                            <Collapse key={`collapse-item-${i}`}>
                                <CollapseHeader>
                                    <View>
                                        <Text>{store.name}</Text>
                                    </View>
                                </CollapseHeader>
                                <CollapseBody>
                                    {store.fruits.map((fruit, fi) => {
                                        return (
                                            <View key={`fruit-row-${fi}`}>
                                                <Text>{fruit.name} {`${fruit.stock}`}</Text>
                                                <Button
                                                    title={'Transfer'}
                                                    style={styles.input}
                                                    onPress={this.onShowTransferModal.bind(this, store, fruit)}
                                                />
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
    }
});