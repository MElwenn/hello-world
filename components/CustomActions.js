
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import firebase from 'firebase';

/**
 * @requires prop-types
 * @requires react
 * @requires react-native
 * @requires expo-permissions
 * @requires expo-image-picker
 * @requires expo-location
 * @requires firebase
 */

export default class CustomActions extends React.Component {
    constructor() {
        super();
    }

    state = {
        image: null,
    }

    /** 
     * asks user for permission to access MEDIA_LIBRARY
     * allows user to pick an image from own device
     * @function pickImage
     * @async
    */
    pickImage = async () => {
        try {
            // get Permission to access MEDIA_LIBRARY
            const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

            //only proceed if user granted permission
            if (status === 'granted') {

                // let user pick an image
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 1
                }).catch(error => console.log(error));

                // check if user cancelled image selection
                if (!result.cancelled) {
                    const imageUrl = await this.uploadImage(result.uri);
                    //update state and store picked image
                    this.props.onSend({ image: imageUrl });
                }

            }
        } catch (error) {
            console.log(error.message);
        }
    }

    /** 
     * asks user for permission to access CAMERA and MEDIA_LIBRARY
     * allows user user to take a photo
     * @function takePhoto
     * @async
    */
    takePhoto = async () => {
        try {
            // get Permission to access MEDIA_LIBRARY and CAMERA
            const { status } = await Permissions.askAsync(
                Permissions.CAMERA,
                Permissions.MEDIA_LIBRARY
            );

            //only proceed if user granted permission
            if (status === 'granted') {

                //let user take a photo
                let result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                }).catch(error => console.log(error));

                // check if user canceled taking a photo
                if (!result.cancelled) {
                    const imageSource = await this.uploadImage(result.uri);
                    //update state and store photo
                    this.props.onSend({ image: imageSource });
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
     * upload an image from firebase storage as blob
     * manages XMLHttpRequest
     * returns imageURL
     * @function uploadImage
     * @async
     * @returns imageURL
     */
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
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
     * asks user for permission to access LOCATION
     * allow user to share current location
     * checks if device provides location data
     * @function getLocation
     * @async
     * @param {number} latitude - location.coords
     * @param {number} longitude - location.coords
     * @returns location.coords
     */
    getLocation = async () => {
        // get Permission to access LOCATION
        const { status } = await Permissions.askAsync(Permissions.LOCATION);

        //only proceed if user granted permission
        if (status === 'granted') {
            try {
                let location = await Location.getCurrentPositionAsync({});

                // check if device provided current position
                if (location) {
                    this.props.onSend({
                        location: {
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude
                        }
                    })
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    /**
     * lets the user choose an action when '+' is clicked
     * @function onActionPress
     * @returns options for custom actions: pickImage, takePhoto, shareLocation
     */
    onActionPress = () => {
        // array of availabe CustomActions
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