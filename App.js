/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import Router from './src/components/Router';
import {subscriberAuth, registerAppWithFCM, getDeviceToken, listenTokenChange, addUserInfoDoDb} from './src/firebase/service';

export default class App extends React.Component {
  state = {
    initializing: true,
    user: null,
    message: undefined
  };

  async componentDidMount () {
    await registerAppWithFCM();
    await subscriberAuth(this.onAuthStateChanged);

    await messaging().onMessage(remoteMessage => {
      console.log(
          'Notification from server: ',
          remoteMessage.data,
      );
    });
  }

  onAuthStateChanged = async (user) => {
    this.setUser(user);
    if (this.state.initializing) {
      this.setInitializing(false);
    }
    if (user){
      await addUserInfoDoDb(user);
      await listenTokenChange(user);
    }
  };

  setUser = (user) => {
    this.setState({user});
  };

  setInitializing = () => {
    this.setState({initializing: false});
  };

  render() {
    if (this.state.initializing) {
      return null;
    }
    return (
        <NavigationContainer>
          <Router user={this.state.user} />
        </NavigationContainer>
    )
  }
}

// export default function App() {
//   const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState();
//
//   // useEffect(() => {
//   //   return registerAppWithFCM();
//   // });
//
//   async function onAuthStateChanged(user) {
//     setUser(user);
//     if (initializing) {
//       setInitializing(false);
//     }
//     if (user){
//       await addUserInfoDoDb(user);
//       await getDeviceToken(user);
//       await listenTokenChange(user);
//     }
//   }
//
//   // messaging().onNotificationOpenedApp(remoteMessage => {
//   //   console.log(
//   //       'Notification caused app to open from background state:',
//   //       remoteMessage.notification,
//   //   );
//   //   navigation.navigate(remoteMessage.data.type);
//   // });
//
//   useEffect(() => {
//     registerAppWithFCM();
//     return subscriberAuth(onAuthStateChanged);
//   }, [initializing]);
//
//   if (initializing) {
//     return null;
//   }
//
//   return (
//     <NavigationContainer>
//       <Router user={user} />
//     </NavigationContainer>
//   );
// }
