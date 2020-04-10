import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import storage from '@react-native-firebase/storage';
import {AccessToken, LoginManager} from 'react-native-fbsdk';

export const subscriberAuth = (callback) => {
    auth().onAuthStateChanged(callback);
};

export const signIn = (email, password) => auth().signInWithEmailAndPassword(email, password);

export const signUp = (email, password) => auth().createUserWithEmailAndPassword(email, password);

export async function onFacebookButtonPress() {
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

export const addUserInfoDoDb = async (user) => {
    if (user.uid && user.providerData && user.providerData[0]) {
        const token = await messaging().getToken();
        await firestore().collection("users").doc(user.uid).set({
            ...user.providerData[0],
            ...{tokens: firestore.FieldValue.arrayUnion(token)}
        });
    }
};

export const storageReference = (url) => storage().ref(url);

export const databaseReference = (collection) => firestore().collection(collection);

export async function registerAppWithFCM() {
    await messaging().registerDeviceForRemoteMessages();
    await requestUserPermission();
}

export async function requestUserPermission() {
    await messaging().requestPermission();
}

export async function saveTokenToDatabase(token, user) {
    await firestore()
        .collection('users')
        .doc(user.uid)
        .update({
            tokens: firestore.FieldValue.arrayUnion(token),
        });
}

// export async function getDeviceToken(user) {
//     await messaging()
//         .getToken()
//         .then(token => {
//             return saveTokenToDatabase(token, user);
//         });
// }

export async function listenTokenChange(user) {
    await messaging().onTokenRefresh(token => {
        saveTokenToDatabase(token, user);
    })
}
