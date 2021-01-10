import React, { Component } from 'react';
//import { StyleSheet, Text, View, TextInput, Alert, Button, ScrollView } from 'react-native'; // non of it is actually used (anymore)

// import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// import react native gesture handler
import 'react-native-gesture-handler';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// import firebase
//const firebase = require('firebase');
//require('firebase/firestore');

// Create the navigator
const Stack = createStackNavigator();

// Create firebast constructor (remove later)
/*const firebaseConfig = {
  apiKey: "AIzaSyCiSiaZpYcUAYUy3UJuCGtscXEFxPZ1WMM",
  authDomain: "test-4e483.firebaseapp.com",
  projectId: "test-4e483",
  storageBucket: "test-4e483.appspot.com",
  messagingSenderId: "920129606551",
  appId: "1:920129606551:web:23a395bc1420f247a36ad2"
};*/

/*if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

this.referenceShoppingLists = firebase.firestore().collection('shoppinglists');*/

export default class App extends Component {

  render() {

    // remove later (as needed for the shopping list example only)
    //this.state = {
    //  lists: [],
    //};

    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Start"
        >
          <Stack.Screen
            name="Start"
            component={Start}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}