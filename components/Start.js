import React from 'react';
import { View, Text, TextInput, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * @requires react
 * @requires react-native
 */

const backgroundImage = require('../assets/Background_Image.png');

export default class Start extends React.Component {

    constructor(props) {
        super(props);
        this.state = { name: '', colorChoice: '' };
    }

    /**
     * optional user input sets user name and background-color
     * click on "Start Chatting" lets user enter the chat room
     * @param {string} username
     * @param {string} backgroundColor
     */

    render() {
        return (
            <ImageBackground source={backgroundImage} style={{ width: '100%', height: '100%' }}>
                <Text style={styles.title}>Chat Bubble</Text>
                <View style={styles.container}>
                    <TextInput
                        accessible={true}
                        accessibilityLabel="enter your name"
                        accessibilityHint="Lets others know your name."
                        accessibilityRole="button"
                        style={styles.textInput}
                        onChangeText={(text) => this.setState({ name: text })}
                        value={this.state.name}
                        placeholder='Your name ...'
                    />
                    <View style={styles.text}>
                        <Text>Choose backgorund color: </Text>
                    </View>
                    <View style={styles.colorOption}>
                        <TouchableOpacity
                            onPress={() => this.setState({ colorChoice: "#090C08" })}
                            style={[styles.colorRadio, styles.color1]}>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.setState({ colorChoice: "#474056" })}
                            style={[styles.colorRadio, styles.color2]}>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.setState({ colorChoice: "#8A95A5" })}
                            style={[styles.colorRadio, styles.color3]}>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.setState({ colorChoice: "#B9C6AE" })}
                            style={[styles.colorRadio, styles.color4]}>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        accessible={true}
                        accessibilityLabel="Start Chatting"
                        accessibilityHint="Lets you enter the chat room."
                        accessibilityRole="button"
                        style={styles.button}
                        onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, colorChoice: this.state.colorChoice })}>
                        <Text style={styles.buttonText}>Start Chatting</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        )
    }
}

/* Styling section */
const styles = StyleSheet.create({
    title: {
        alignSelf: "center",
        fontSize: 45,
        fontWeight: '600',
        color: "#ffffff",
        flex: 1,
        marginTop: 80
    },
    container: {
        backgroundColor: "#ffffff",
        flex: 1,
        alignItems: "center",
        height: "44%",
        width: "88%",
        margin: 20
    },
    text: {
        fontSize: 16,
        fontWeight: '300',
        color: "#757083",
        width: "88%",
        height: "20%",
        marginTop: "5%",
    },
    textInput: {
        fontSize: 16,
        fontWeight: '300',
        opacity: 50,
        color: "#757083",
        borderWidth: 1.5,
        borderColor: "#757083",
        borderRadius: 2,
        width: "88%",
        height: "50%",
        marginTop: "5%",
    },
    colorOption: {
        flex: 4,
        flexDirection: "row",
        alignSelf: "flex-start",
        justifyContent: "space-around",
        width: "88%",
        paddingLeft: 2,
        marginBottom: 20
    },
    colorRadio: {
        width: 30,
        height: 30,
        borderRadius: 20,
        alignItems: "flex-start",
        marginBottom: "10%",
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
        backgroundColor: "#757083",
        alignItems: "center",
        borderRadius: 2,
        width: "88%",
        height: "20%",
        margin: 20
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: "#ffffff",
        marginTop: 10,
        justifyContent: "center",
    }
})
