import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

const CustomButton = (props) => {
    return (
        <TouchableOpacity
            style={[styles.button, props.customStyle]}
            onPress={props.onPress}>
            {props.children}
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        padding: 10,
        height: 40,
        marginBottom: 15,
    }
});


export default CustomButton;
