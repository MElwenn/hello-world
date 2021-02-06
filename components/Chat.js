import React from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import firebase from 'firebase';

/**
 * @class Chat
 * @requires react
 * @requires react-native
 * @requires react-native-gifted-chat
 * @requires react-native-community/async-storage
 * @requires react-native-community/netinfo
 * @requires CustomActions from './CustomActions'
 * @requires firebase
 */

// Create the chat component
export class Chat extends React.Component {
    constructor() {
        super();

        // initialize states
        this.state = {
            messages: [],
            user: {
                _id: '',
                name: '',
                avatar: ''
            },
            uid: 0,
            loggedInText: '',
            isConnected: false,
            image: '',
            location: '',
            createdAt: '',
        }

        /**
         * firebase credentials
         * @param {string} apiKey
         * @param {string} authDomain
         * @param {string} databaseURL
         * @param {string} projectId
         * @param {string} storageBucket
         * @param {string} messagingSenderId
         * @param {string} appId
         */

        const firebaseConfig = {
            apiKey: "AIzaSyD2D9ZsvijtkGdVuO3VPe2NxJzVzflJhPA",
            authDomain: "chatapp-23e15.firebaseapp.com",
            databaseURL: "https://chatapp-23e15.firebaseapp.com",
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

    /**
     * @function componentDidMount
     * NetInfo checks if user is online and sets respective state
     * uses firebase anonymous authentication for user authentication
     * updates user state with currently active user data
     * display messages in chronological order & onSnapshot observer
     * load messages from Firebase
     */

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
                        user: {
                            _id: user.uid,
                            name: this.props.route.params.name,
                            avatar: 'https://placeimg.com/140/140/any'
                        },
                        loggedInText: `${this.props.route.params.name} wrote`,
                        messages: []
                    });
                    // display messages in chronological order & onSnapshot observer
                    this.unsubscribe = this.referenceMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
                });
            } else {
                this.setState({
                    isConnected: false,
                });

                // load messages from Firebase
                this.getMessages();
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
        this.authUnsubscribe();
    }

    /**
     * function called as soon as user types a message
     * @function onSend
     * @param {*} messages {message/image/location}
     * @returns {state} message and respective state
     */

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
            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: Date(data.createdAt),
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


    /**
     * adds message object to firestore-collection
     * @function
     * @param {number} _id
     * @param {string} text
     * @param {time} createdAt
     * @param {string} user
     * @param {string} image
     * @param {string} location - latitude and longitude 
     */

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

    /**
     * gets all messages from AsynchStorage
     * @function getMessages
     * @async
     * @returns messages
     */
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

    /**
     * stringifies and saves all messages to AsynchStorage
     * @function saveMessages
     * @async
     * @param {string} message
     * @returns {Promise}
     */
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

    /**
     * delete messages from AsynchStorage
     * @function deleteMessages
     * @async
     */
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

    /**
     * renders custom actions: pickImage, takePhoto, shareLocation
     */
    renderCustomActions = (props) => {
        return <CustomActions {...props} />;
    };

    /**
     * renders users current location if shared by user
     */
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
        /**
         * displays username edited on start-page
         */
        let { name } = this.props.route.params;
        this.props.navigation.setOptions({ title: name });

        /**
         * displays background-color chosen on start-page
         */
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
        )
    }


    /**
     * defines the bubble colors to distinguish between own user messages and other users messages'
     */
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

    /**
     * renders toolbar if online
     */
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