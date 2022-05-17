import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

const genButtonStyle = (styleProps) => {
    return {
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 4,
        backgroundColor: styleProps.backgroundColor || 'rgba(69, 33, 243, 0.51)',
    }
};

export default function Button(props) {
    const { onPress, title = 'Save', styleProps } = props;
    return (
        <Pressable style={genButtonStyle(styleProps)} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 10,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});