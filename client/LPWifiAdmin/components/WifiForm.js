import React from "react";
import { SafeAreaView, View, Text, StyleSheet, TextInput, Alert } from "react-native";
import Button from "./Button";
import DeviceInfo from 'react-native-device-info';

const UPSTREAM_URL = `https://lp-wifi.herokuapp.com`;
// const UPSTREAM_URL = `http://localhost:3005`;

function request_upstream(url, body, cb) {
    fetch(`${UPSTREAM_URL}/${url}`, {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        method: "POST"
    })
    .then((data) => data.json())
    .then((data) => cb(data, null))
    .catch((err) => cb(null, err))
}

/**
 * Helper function to return mac address
 * @returns mac address
 */
async function _getMacAddress() {
    const mac_address = await DeviceInfo.getMacAddress();
    return mac_address;
}
  

const WifiForm = () => {
    const [text, onChangeText] = React.useState("");
    const [number, onChangeNumber] = React.useState(null);
    // const [admin_text, onChangeAdminText] = React.useState("");
    const [admin_name, onChangeAdminName] = React.useState("");
    const [admin_phone, onChangeAdminPhone] = React.useState(null);
    // const [admin_pass, onChangeAdminPass] = React.useState("");
    const ssidHandler = (name, pass) => {
        if (name === '' || pass === '') {
            Alert.alert("Empty details, Pls check and post again");
            return;
        }
        const url_prefix = `api/load_ssid_details`;
        const body = { 'ssid_name': name, 'ssid_pass': pass };
        request_upstream(url_prefix, body, (data, err) => {
            if (err) {
                console.log(err);
            }
        });
        Alert.alert("Loaded ssid details");
    };
    const registerHandler = async (name, phone) => {
        if (name === '' || phone === '') {
            Alert.alert("Empty details, Pls check and post again");
            return;
        }
        const url_prefix = `api/register_admin`;
        console.log(name, phone);
        const mac_address = await _getMacAddress();
        const body = { 'name': name, 'mobilenumber': phone, 'mac_address': mac_address};
        request_upstream(url_prefix, body, (data, err) => {
            if (err) {
                console.log(err);
            }
        });
        Alert.alert("Registered admin");
    };

    return (
        <View style={{ flexGrow: 1, justifyContent: 'space-around', backgroundColor: '#fef5e5', }}>
            <SafeAreaView>
                <Text style={styles.labelHeader}>Enter your SSID details</Text>
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
                <Button onPress={() => ssidHandler(text, number)} title="Register SSID details" styleProps={{ custom_style: styles.custom_button }} />
            </SafeAreaView>
            <SafeAreaView>
                <Text style={{alignSelf: 'center', marginBottom: 10}}>Register your phone with backend {'(only one time)'} </Text>
                {/* TODO: Add admin authentication */}
                {/* <TextInput
                    style={styles.input}
                    onChangeText={onChangeAdminText}
                    placeholder="Enter Admin username"
                    value={admin_text}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeAdminPass}
                    value={admin_pass}
                    placeholder="Enter Admin password"
                /> */}
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeAdminName}
                    placeholder="Enter your name"
                    value={admin_name}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeAdminPhone}
                    value={admin_phone}
                    placeholder="Enter your phone"
                    keyboardType="numeric"
                />
                <Button onPress={() => registerHandler(admin_name, admin_phone)} title="Register" styleProps={{ custom_style: styles.custom_button_2 }} />
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    labelHeader: {
        marginLeft: 20
    },
    custom_button: {
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 4,
        backgroundColor: 'blue',
        marginLeft: 100,
        marginRight: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },

    custom_button_2: {
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 4,
        backgroundColor: 'green',
        marginLeft: 100,
        marginRight: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});

export default WifiForm;