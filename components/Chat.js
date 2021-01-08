import React from 'react';
import { KeyboardAvoidingView, Platform, View, StyleSheet } from 'react-native';
import { GiftedChat, Bubble, SystemMessage } from 'react-native-gifted-chat';


/* ERROR: index.js:1 Warning: Cannot update a component (`StackNavigator`) 
while rendering a different component (`Chat`). To locate the bad setState() 
call inside `Chat`, follow the stack trace as described in https://fb.me/setstate-in-render */

/* Create the chat component */
export class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
        }
    }

    /* Exercise 5.3, Task 4.: "add two static messages (a system message and a normal message)" */
    componentDidMount() {
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hello developer',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                {
                    _id: 2,
                    text: 'Hello, you have entered the chat',
                    createdAt: new Date(),
                    system: true,
                },
            ],
        })
    }

    //componentWillUnmount() { }

    /* function called as soon as user types a message */
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }

    render() {
        // Inherit username edited on start-page
        let { name } = this.props.route.params;
        this.props.navigation.setOptions({ title: name });

        // Inherit color chosen on start-page (does not work unfortunately)
        let { colorChoice } = this.props.route.params;
        this.props.navigation.setOptions({ backgroundColor: colorChoice });

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: colorChoice,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: 1,
                    }}
                />
                {/* avoid android keybords to overlay messages */}
                {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            </View>
        )
    }

    /* change the bubble color to distinguish between own messages and others' */
    renderBubble(props) {
        return (
            <Bubble {...props}
                wrapperStyle={
                    {
                        left: {
                            backgroundColor: '#ffffff',
                        },
                        right: {
                            backgroundColor: '#000000'
                        }
                    }
                }
            />
        )
    }
}

export default Chat;