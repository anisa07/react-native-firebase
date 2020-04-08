import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import {LoginManager, AccessToken} from 'react-native-fbsdk';

async function onFacebookButtonPress() {
  // Attempt login with permissions
  const result = await LoginManager.logInWithPermissions([
    'public_profile',
    'email',
  ]);

  if (result.isCancelled) {
    throw 'User cancelled the login process';
  }

  // Once signed in, get the users AccesToken
  const data = await AccessToken.getCurrentAccessToken();

  if (!data) {
    throw 'Something went wrong obtaining access token';
  }

  // Create a Firebase credential with the AccessToken
  const facebookCredential = auth.FacebookAuthProvider.credential(
    data.accessToken,
  );

  // Sign-in the user with the credential
  return auth().signInWithCredential(facebookCredential);
}

function AuthScreen(props) {
  const [error, setError] = useState(undefined);
  const [message, setMessage] = useState(undefined);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');

  const toggleMode = () => {
    mode === 'login' ? setMode('signup') : setMode('login');
  };

  const handleLogin = () => {
    setError(undefined);

    const validate = text => {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(text) === false) {
        return setError('Email is Not Correct');
      }
    };

    validate(login);

    if (password.length < 6) {
      return setError('Password length less then 5');
    }

    if (mode === 'login') {
      auth()
        .signInWithEmailAndPassword(login, password)
        .then(() => {
          props.navigation.goBack();
        })
        .catch(error => {
          if (error.code === 'auth/user-not-found') {
            return setError('Email is not registered yet!');
          }

          if (error.code === 'auth/weak-password') {
            return setError('Password should be st least 6 symbols!');
          }

          setError(error.message);
        });
    } else {
      auth()
        .createUserWithEmailAndPassword(login, password)
        .then(() => {
          props.navigation.goBack();
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            return setError('That email address is already in use!');
          }

          if (error.code === 'auth/invalid-email') {
            return setError('That email address is invalid!');
          }

          setError(error.message);
        });
    }
  };

  const handleFaceBookLogin = () => {
    onFacebookButtonPress()
      .then(() => {
        props.navigation.goBack();
      })
      .catch(error => {
        setError(error);
      });
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setLogin(text)}
          value={login}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
          value={password}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonLabel}>
            {mode === 'signup' ? 'Sign Up' : 'Login'}
          </Text>
        </TouchableOpacity>
        {Platform.OS === 'android' && (
          <>
            <Text style={styles.or}>Or</Text>
            <TouchableOpacity
              style={styles.facebook}
              onPress={handleFaceBookLogin}>
              <Ionicons
                name="logo-facebook"
                size={30}
                style={{marginTop: -3}}
                color="#fff"
              />
            </TouchableOpacity>
          </>
        )}
        <Text style={styles.modeText}>
          {mode === 'login'
            ? 'Not registered yet ? Switch to Sign Up'
            : 'Already registered? Switch to Login'}
        </Text>
        <TouchableOpacity style={styles.switch} onPress={toggleMode}>
          <Text style={styles.labelBlue}>
            Switch to {mode === 'login' ? 'Sign Up' : 'Login'}
          </Text>
        </TouchableOpacity>
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#e91e63',
    padding: 10,
    marginBottom: 15,
    height: 40,
  },
  buttonLabel: {
    color: '#eee',
  },
  facebook: {
    alignItems: 'center',
    backgroundColor: '#3C5898',
    padding: 10,
    height: 40,
    marginBottom: 15,
  },
  switch: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 10,
    height: 40,
    marginBottom: 15,
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
    color: '#3C5898',
  },
});

export default AuthScreen;
