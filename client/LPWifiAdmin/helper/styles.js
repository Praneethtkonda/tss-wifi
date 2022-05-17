import { Platform } from 'react-native';

const generateBoxShadowStyle = (
    xOffset,
    yOffset,
    shadowColorIos,
    shadowOpacity,
    shadowRadius,
    elevation,
    shadowColorAndroid,
) => {
    if (Platform.OS === 'ios' || Platform.OS === 'web') {
        return {
            shadowColor: shadowColorIos,
            shadowOffset: { width: xOffset, height: yOffset },
            shadowOpacity,
            shadowRadius,
        };
    } else if (Platform.OS === 'android') {
        return {
            elevation,
            shadowColor: shadowColorAndroid,
        };
    }
};

export { generateBoxShadowStyle };