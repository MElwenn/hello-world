import React from 'react';
import { KeyboardAvoidingView, Platform, View, StyleSheet } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo'; // missing in depencies: "@react-native-community/netinfo": "^4.7.0",
//import NetInfo from '@react-native-community';

import CustomActions from './CustomActions'; //  (Ex 5.6)
//import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

/* ERROR: index.js:1 Warning: Cannot update a component (`StackNavigator`) 
while rendering a different component (`Chat`). To locate the bad setState() 
call inside `Chat`, follow the stack trace as described in https://fb.me/setstate-in-render */

// import Firestore
import firebase from 'firebase'; // check, if this works with Node.js, if YES, remove the following two lines 
//const firebase = require('firebase'); // require is NOT ES6, but Node.js style
//require('firebase/firestore');

/* Create the chat component */
export class Chat extends React.Component {
    constructor() {
        super();

        //let createdAt;
        //let createdAt = createdAt && createdAt.toDate && createdAt.toDate().getTime();
        //this.createdAt = createdAt.toDate().getTime();
        //this.createdAt = createdAt && createdAt.toDate && createdAt.toDate().getTime();

        this.state = {
            messages: [],
            user: {
                _id: '',
                name: '',
                avatar: ''
            },
            uid: 0,  // is this really needed if I have ONE chatroom for all users anywhay? Assume: It is for distinction of users.
            loggedInText: '',
            isConnected: false,
            image: '',
            location: '',
            createdAt: '',
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
        // check if the user is online
        NetInfo.fetch().then((state) => {
            if (state.isConnected) {
                console.log('online');
                // authentication anonymously in firebase
                this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
                    if (!user) {
                        try {
                            await firebase.auth().signInAnonymously();
                        }
                        catch (error) {
                            console.log(`Sign in failed: ${error.message}`);
                        }
                    }

                    //update user state with currently active user data
                    this.setState({
                        isConnected: true,
                        //uid: user.uid,
                        user: {
                            _id: user.uid,
                            name: this.props.route.params.name,
                            //name: this.props.navigation.state.params.name,
                            avatar: 'https://placeimg.com/140/140/any'
                        },
                        //loggedInText: 'Hello there',
                        loggedInText: `${this.props.route.params.name} wrote`, // Expected .name to be passed, when bubble is rendered
                        //loggedInText: `${this.props.navigation.state.params.name} wrote:`,
                        messages: []
                    });
                    // display messages in chronological order & onSnapshot observer
                    this.unsubscribe = this.referenceMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
                    //this.unsubscribe = this.referenceMessages.onSnapshot(this.onCollectionUpdate) // ERROR: [react-native-gifted-chat] GiftedChat: `_id` is missing for message {"image":"","location":""}
                });
            } else {
                this.setState({
                    isConnected: false,
                });

                // load messages from Firebase
                this.getMessages();
                // prevent users from composing new messages in the InputToolbar  (=> contradiction?)
            }
            // save new messages locally via asyncStorage (=> contradiction?)
        });
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
            this.saveMessages();
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
                //text: data.text.toString(), // ERROR (console): Chat.js:116 Uncaught TypeError: Cannot read property 'toString' of undefined 

                createdAt: Date(data.createdAt), // ERROR (browser): invalid date 
                //createdAt: data.createdAt.toDate(), //// ERROR (console): Chat.js:118 Uncaught TypeError: Cannot read property 'toDate' of undefined
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
            user: message.user,            // Expected .name to be passed, when bubble is rendered
            uid: this.state.uid,
            image: message.image || '',
            location: message.location || ''
        });
    }

    // get all messages from AsynchStorage
    getMessages = async () => {
        let messages = [];
        try {
            messages = (await AsynchStorage.getItem('messages')) || [];
            this.setState({
                messages: JASON.parse(messages),
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    // save all messages to AsynchStorage
    saveMessages = async () => {
        try {
            await AsyncStorage.setItem(
                'messages',
                JSON.stringify(this.state.messages)
            );
        } catch (error) {
            console.log(error.message);
        }
    };

    // delete messages from AsynchStorage
    deleteMessages = async () => {
        try {
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: []
            })
        } catch (error) {
            console.log(error.message);
        }
    };

    // render custom actions: pickImage, takePhoto, shareLocation (Ex 5.6)
    renderCustomActions = (props) => {
        return <CustomActions {...props} />;
    };

    renderCustomView(props) {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    provider={PROVIDER_GOOGLE}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
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
                    renderActions={this.renderCustomActions.bind(this)}
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={this.state.user}
                />
                {/* avoid android keybords to overlay messages */}
                {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            </View>
        )  // removed this from GiftedChat, replaced by renderActions={this.renderCustomActions}
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

    // render toolbar if online
    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }
    }
}

export default Chat;