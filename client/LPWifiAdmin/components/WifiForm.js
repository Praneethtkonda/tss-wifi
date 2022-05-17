import React from "react";
import { SafeAreaView, Text, StyleSheet, TextInput } from "react-native";
import Button from "./Button";

const WifiForm = () => {
    const [text, onChangeText] = React.useState("");
    const [number, onChangeNumber] = React.useState(null);
    const selectHandler = () => {

    };
    return (
        <SafeAreaView>
            <Text>
                Enter your SSID details
            </Text>
            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                placeholder="Enter Wifi SSID"
                value={text}
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeNumber}
                value={number}
                placeholder="Enter Wifi password"
                keyboardType="numeric"
            />
            <Button onPress={selectHandler} title="Approve" styleProps={{ backgroundColor: 'blue' }} visible={false} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});

export default WifiForm;