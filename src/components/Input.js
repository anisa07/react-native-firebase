import React from 'react';
import {StyleSheet, Text, TextInput} from 'react-native';

const Input = (props) => {
    const onChange = (text) => props.changeText(text);
    return (
        <>
            <Text style={[styles.label, props.styleLabel]}>{props.label}</Text>
            <TextInput
                style={[styles.input, props.styleInput]}
                secureTextEntry={props.pwd}
                onChangeText={onChange}
                value={props.value}
            />
        </>
    );
};

const styles = StyleSheet.create({
    label: {
        height: 30,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
    }
});

export default Input;
