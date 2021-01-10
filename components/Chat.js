import React from 'react';
import { KeyboardAvoidingView, Platform, View, StyleSheet } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

/* ERROR: index.js:1 Warning: Cannot update a component (`StackNavigator`) 
while rendering a different component (`Chat`). To locate the bad setState() 
call inside `Chat`, follow the stack trace as described in https://fb.me/setstate-in-render */

// import Firestore
const firebase = require('firebase');
require('firebase/firestore');

/* Create the chat component */
export class Chat extends React.Component {
    constructor() {
        super();

        this.state = {
            messages: [],
            user: {
                _id: '',
                name: '',
                avatar: ''
            },
            uid: 0,  // is this really needed if I have ONE chatroom for all users anywhay?
            loggedInText: '',
            isConnected: false,
            image: '',
            location: ''
        }

        // allow app to connect to Firestore
        const firebaseConfig = {
            apiKey: "AIzaSyD2D9ZsvijtkGdVuO3VPe2NxJzVzflJhPA",
            authDomain: "chatapp-23e15.firebaseapp.com",
            databaseURL: "https://chatapp-23e15.firebaseapp.com", // Is this needed?
            projectId: "chatapp-23e15",
            storageBucket: "chatapp-23e15.appspot.com",
            messagingSenderId: "210840460009",
            appId: "1:210840460009:web:224052ea77e9e83bd62e78"
        }

        // initialize Firestore app
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        // reference to Firestore collection
        this.referenceMessages = firebase.firestore().collection('messages');
    }

    componentDidMount() {

        // authentication anonymos in firebase
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (!user) {
                await firebase.auth().signInAnonymously();
            }

            //update user state with currently active user data
            this.setState({
                isConnected: true,
                uid: user.uid,
                user: {
                    _id: user.uid,
                    name: this.props.route.params.name,
                    avatar: 'https://placeimg.com/140/140/any'
                },
                //loggedInText: 'Hello there',
                loggedInText: `${this.props.route.params.name} wrote`,
                messages: []
            });

            /*update user state with currently active user data
            this.setState({
                user: {
                    _id: user._id,
                    name: this.props.route.params.user,
                },
                messages: [],
            });*/
        });

        this.referenceMessages = firebase.firestore().collection('messages');

        // display messages in chronological order & onSnapshot observer
        this.unsubscribe = this.referenceMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
        //this.unsubscribe = this.referenceMessages.onSnapshot(this.onCollectionUpdate) // ERROR: [react-native-gifted-chat] GiftedChat: `_id` is missing for message {"image":"","location":""}
    }

    componentWillUnmount() {
        this.unsubscribe();
        this.authUnsubscribe();
    }

    /* function called as soon as user types a message */
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }), () => {
            this.addMessage();
        })
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // go through each document
        querySnapshot.forEach((doc) => {
            // get the QueryDocumentSnapshot's data
            var data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                //text: data.text.toString(), // ERROR (console): Chat.js:116 Uncaught TypeError: Cannot read property 'toDate' of undefined 
                createdAt: data.createdAt, // ERROR (browser): invalid date 
                //createdAt: data.createdAt.toDate(),
                //user: data.user,
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                    avatar: data.user.avatar
                },
                image: data.image || '',
                location: data.location || ''
            });
        });
        this.setState({
            messages,
        });
    };

    // add message object to firestore-collection
    addMessage() {
        const message = this.state.messages[0];
        this.referenceMessages.add({
            _id: message._id,
            text: message.text || '',
            createdAt: message.createdAt,
            user: message.user,
            uid: this.state.uid,
            image: message.image || '',
            location: message.location || ''
        });
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
                    user={this.state.user}
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