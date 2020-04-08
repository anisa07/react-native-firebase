import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

function CustomIcon({name, focused, focusedColor, defaultColor}) {
    return (
        <Ionicons
            name={name}
            size={30}
            style={{marginBottom: -3}}
            color={focused ? focusedColor : defaultColor}
        />
    );
}

export default CustomIcon;
