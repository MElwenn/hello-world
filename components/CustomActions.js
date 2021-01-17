
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { CAMERA } from 'expo-permissions'; // used in takePhoto
import * as Location from 'expo-location';
import firebase from 'firebase';
//import MapView from 'react-native-maps'; // throws an error
//import { Audio } from 'expo-av';

export default class CustomActions extends React.Component {
    constructor() {
        super();
    }

    state = {
        image: null, // potentially in rather in chat.js ?
    }

    // allow user to pick an image from own device
    pickImage = async () => {
        try {
            const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY); // 'CAMERA_ROLL' is deprecatedts(6385) use 'MEDIA_LIBRARY' instead

            if (status === 'granted') {
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 1
                }).catch(error => console.log(error));

                if (!result.cancelled) {
                    const imageUrl = await this.uploadImage(result.uri);
                    this.props.onSend({ image: imageUrl });
                    /*this.setState({
                        image: result
                    });*/
                }

            }
        } catch (error) {
            console.log(error.message);
        }
    }

    // allow user to take a photo
    takePhoto = async () => {
        try {
            const { status } = await Permissions.askAsync(
                Permissions.CAMERA,
                Permissions.MEDIA_LIBRARY    // 'CAMERA_ROLL' is deprecatedts(6385) use 'MEDIA_LIBRARY' instead
            );

            if (status === 'granted') {
                let result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                }).catch(error => console.log(error));

                if (!result.cancelled) {
                    const imageSource = await this.uploadImage(result.uri);
                    this.props.onSend({ image: imageSource });
                }
            }
        }
        catch (error) {
            console.log(error.message);
        }
    }

    // upload an image from firebase storage
    uploadImage = async (uri) => {
        try {
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    console.log(e);
                    reject(new TypeError('Network request failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', uri, true);
                xhr.send(null);
            });
            const getImageName = uri.split('/');
            const imageArreyLenght = getImageName[getImageName.length - 1];
            const ref = firebase
                .storage()
                .ref()
                .child(`images/${imageArreyLenght}`);
            // convert img to blob
            const snapshot = await ref.put(blob);
            blob.close();
            const imageUrl = await snapshot.ref.getDownloadURL();
            return imageUrl;
        }
        catch (error) {
            console.log(error.message);
        }
    }

    // upload image to Storage with fetch() and blob()
    /*uploadImageFetch = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const ref = firebase
            .storage()
            .ref()
            .child(`images/${imageArreyLenght}`);

        const snapshot = await ref.put(blob);

        return await snapshot.ref.getDownloadURL();
    } */

    // allow user to share current location
    getLocation = async () => {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status === 'granted') {
            try {
                let location = await Location.getCurrentPositionAsync({});

                if (location) {
                    this.props.onSend({
                        location: {
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude
                        }
                    })
                    /*this.setState({
                        location: result
                    });*/
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    // allow user to add an audio-recording (to be added later)

    // let the user choose an action when '+' is clicked
    onActionPress = () => {
        const options = ['Pick an image from device', 'Take a Photo', 'Share current location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;

        // availabe CustomActions
        this.context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        console.log('user wants to pick an image');
                        this.pickImage();
                        return;
                    case 1:
                        console.log('user wants to take a photo');
                        this.takePhoto();
                        return;
                    case 2:
                        console.log('user wants to share location');
                        this.getLocation();
                    default:
                }
            },
        );
    };

    render() {
        return (
            <TouchableOpacity
                accessible={true}
                accessibilityLabel="click to choose options"
                accessibilityHint="Add image, take a photo or share your location"
                accessibilityRole="button"
                style={[styles.container]}
                onPress={this.onActionPress}>
                <View style={[styles.wrapper, this.props.wrapperStyle]}>
                    <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

/* Styling section */
const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

// pass CustomActions through component tree
CustomActions.contextTypes = {
    actionSheet: PropTypes.func,
};