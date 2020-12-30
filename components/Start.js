import React, { Component } from 'react';
import { View, Text, TextInput, Button, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

// backgorund image from project brief
const backgroundImage = require('../assets/Background_Image.png');

// Background color options HEX codes from project brief
// const colorOptions = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

export default class Start extends React.Component {

    constructor(props) {
        super(props);
        this.state = { name: '', backgroundColor: '' };
    }
    render() {
        //let name = this.props.route.params.name; // OR ...   BOTH throws an ERROR "Cannot read property 'name' of undefined"
        //let { name } = this.props.route.params;
        return (
            <ImageBackground source={backgroundImage} style={{ width: '100%', height: '100%' }}>
                <Text style={styles.title}>Chat Bubble</Text>
                <View style={styles.container}>  {/* { flex: 1, justifyContent: 'center', alignItems: 'center' } */}

                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                        onChangeText={(text) => this.setState({ text })}
                        value={this.state.text}
                        placeholder='Your name ...'
                    />
                    <Text style={styles.text}>Coose backgorund color: </Text>
                    <View style={styles.colorOption}>
                        <TouchableOpacity
                            onPress={() => this.setState({ colorOption: "#090C08" })}
                            style={[styles.colorRadio, styles.color1]}>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.setState({ colorOption: "#474056" })}
                            style={[styles.colorRadio, styles.color2]}>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.setState({ colorOption: "#8A95A5" })}
                            style={[styles.colorRadio, styles.color3]}>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.setState({ colorOption: "#B9C6AE" })}
                            style={[styles.colorRadio, styles.color4]}>
                        </TouchableOpacity>
                    </View>
                    <Button
                        style={styles.button} // removed: color="#757083"
                        color="#757083"
                        title="Start chatting"
                        onPress={() => this.props.navigation.navigate('Chat')} // removed , { name: this.state.name } as it throws an error
                    />
                </View>
            </ImageBackground>
        )
    }
}

/* Styling section */
const styles = StyleSheet.create({
    title: {
        alignItems: "center",
        justifyContent: "center",
        fontSize: 45,
        fontWeight: 600,
        color: "#ffffff",
        flex: 1,
        marginTop: 80
    },
    container: {
        backgroundColor: "#ffffff",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: "44%",
        width: "88%",
        margin: 20
    },
    inputBox: {
        fontSize: 16,
        fontWeight: 600,
        color: "#000000",
        borderColor: "grey",
        width: "88%",
        marginTop: 30,
        marginBottom: 30,

    },
    text: {
        fontSize: 16,
        fontWeight: 300,
        color: "#757083"
    },
    colorOption: {
        flex: 4,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        margin: 15
    },
    colorRadio: {
        width: 30,
        height: 30,
        borderRadius: 20,
        margin: 10
    },
    color1: {
        backgroundColor: "#090C08"
    },
    color2: {
        backgroundColor: "#474056"
    },
    color3: {
        backgroundColor: "#8A95A5"
    },
    color4: {
        backgroundColor: "#B9C6AE"
    },
    button: {
        fontSize: 16,
        fontWeight: 600,
        color: "#ffffff",
        backgroundColor: "#757083"
    }
})