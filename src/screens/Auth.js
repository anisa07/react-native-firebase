import React, {useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {onFacebookButtonPress, signIn, signUp} from '../firebase/service';
import Input from '../components/Input';
import CustomButton from '../components/CustomButton';
import {attention, fontOnDark, button} from '../colors';

function AuthScreen(props) {
    const [error, setError] = useState(undefined);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState('login');

    const toggleMode = () => {
        mode === 'login' ? setMode('signup') : setMode('login');
    };

    const handleLogin = () => {
        setError(undefined);

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(login) === false) {
            return setError('Email is Not Correct');
        }

        if (password.length < 6) {
            return setError('Password length less then 6');
        }

        if (mode === 'login') {
            signIn(login, password)
                .catch(error => {
                    if (error.code === 'auth/user-not-found') {
                        return setError('Email is not registered yet!');
                    }

                    if (error.code === 'auth/wrong-password') {
                        return setError('Password or Email is not correct!');
                    }

                    setError(error.message);
                });
        } else {
            signUp(login, password)
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        return setError('That email address is already in use!');
                    }

                    if (error.code === 'auth/invalid-email') {
                        return setError('That email address is invalid!');
                    }

                    if (error.code === 'auth/weak-password') {
                        return setError('Password is not correct!');
                    }

                    setError(error.message);
                });
        }
    };

    const handleFaceBookLogin = () => {
        onFacebookButtonPress()
            .catch(error => {
                setError(error);
            });
    };

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Input label="Email" changeText={setLogin} value={login}/>
                <Input label="Password" changeText={setPassword} value={password} pwd={true}/>
                {error && <Text style={styles.error}>{error}</Text>}
                <CustomButton onPress={handleLogin} customStyle={styles.button}>
                    <Text style={styles.buttonLabel}>
                        {mode === 'signup' ? 'Sign Up' : 'Login'}
                    </Text>
                </CustomButton>
                {Platform.OS === 'android' && (
                    <>
                        <Text style={styles.or}>Or</Text>
                        <CustomButton onPress={handleFaceBookLogin} customStyle={styles.facebook}>
                            <Ionicons
                                name="logo-facebook"
                                size={30}
                                style={{marginTop: -3}}
                                color="#fff"
                            />
                        </CustomButton>
                    </>
                )}
                <Text style={styles.modeText}>
                    {mode === 'login'
                        ? 'Not registered yet ? Switch to Sign Up'
                        : 'Already registered? Switch to Login'}
                </Text>
                <CustomButton onPress={toggleMode} customStyle={styles.switch}>
                    <Text style={styles.labelBlue}>
                        Switch to {mode === 'login' ? 'Sign Up' : 'Login'}
                    </Text>
                </CustomButton>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    label: {
        height: 30,
    },
    or: {
        alignSelf: 'center',
        height: 30,
    },
    button: {
        backgroundColor: attention,
    },
    buttonLabel: {
        color: fontOnDark,
    },
    facebook: {
        backgroundColor: button,
    },
    switch: {
        backgroundColor: 'transparent',
    },
    error: {
        alignSelf: 'center',
        color: '#f00',
        height: 30,
    },
    modeText: {
        height: 30,
        alignSelf: 'center',
    },
    labelBlue: {
        height: 30,
        color: button,
    },
});

export default AuthScreen;
