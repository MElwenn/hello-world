import React from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet } from 'react-native';

/* ERROR: index.js:1 Warning: Cannot update a component (`StackNavigator`) 
while rendering a different component (`Chat`). To locate the bad setState() 
call inside `Chat`, follow the stack trace as described in https://fb.me/setstate-in-render */

export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = { text: '' };
    }
    alertMyText(input = []) {
        Alert.alert(input.text);
    };

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
                    backgroundColor: { colorChoice },
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                <ScrollView>
                    <Text>This is the chat</Text>
                    <Text>You wrote: {this.state.text}</Text>
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                        onChangeText={(text) => this.setState({ text })}
                        value={this.state.text}
                        placeholder='Type here ...'
                    />
                </ScrollView>
                <Button
                    onPress={() => {
                        this.alertMyText({ text: this.state.text });
                    }}
                    title="Send"
                />
            </View>
        );
    };
}