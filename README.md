# Chat Bubble
Chat Bubble is a chat app that allow users to enter a chat room to chat with other users.
On the Start Page you can enter your real or a nick name and choose your favorite background color.
After pressing "Start chat you can chat with other people, take photos or send images form you device or share you current location. 
## Getting started
**Setup a database using Google Firebase**
1. Got to https://firebase.google.com/ and login
2. Follow the "Go to console" -link and click on "Create Project"
3. Enter a project name, fill the the form and click "Create" when finished.
4. To create a data base, click on "Develop" in the menu on the left.
5. Select "Create Database", be sure NOT to create a "Realtime Database" and choose “Start in test mode”.
6. Create a new collection and give it a name.
7. Add data to the structure in the firebase form and click "Save" when finished.
8. Head over to your terminal and run `npm install --save firebase@7.9.0`.
9. open up your “App.js” file in your code editor and import Firestore:
`const firebase = require('firebase');`
`require('firebase/firestore');``
10. Back in the Firestore project in your browser, open up your “Project Settings” and copy the config-code provided in the modal...
11. ...finally paste into `const firebaseConfig = {}` of you App.js file
12. You should be able to query yout data base now.

## Dependencies
The following modules can be installed using `npm install`
### Modules
"@react-native-community/async-storage": "~1.12.0",
    "@react-native-community/masked-view": "0.1.10",
    "@react-native-community/netinfo": "5.9.7",
    "@react-navigation/native": "^5.8.10",
    "@react-navigation/stack": "^5.12.8",
    "cookies": "^0.8.0",
    "expo": "~40.0.0",
    "expo-image-picker": "~9.2.0",
    "expo-location": "~10.0.0",
    "expo-permissions": "~10.0.0",
    "expo-status-bar": "~1.0.3",
    "firebase": "^7.9.0",
    "react": "16.13.1",
    "react-dom": "16.13.1",
    "react-native": "https://github.com/expo/react-native/archive/sdk-40.0.1.tar.gz",
    "react-native-gesture-handler": "~1.8.0",
    "react-native-gifted-chat": "^0.16.3",
    "react-native-maps": "0.27.1",
    "react-native-reanimated": "~1.13.0",
    "react-native-safe-area-context": "3.1.9",
    "react-native-screens": "~2.15.0",
    "react-native-web": "~0.13.12",
    "react-navigation": "^4.4.3"

## Libraries
You can download "Gifted Chat" the library use for this app from Github: https://github.com/FaridSafi/react-native-gifted-chat

## Kanban Board
https://trello.com/b/ZMvZoutZ/chatbubble