/**
 * @format
 */

import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('@react-native-firebase/auth', () => {
  return () => ({
    onAuthStateChanged: jest.fn()
  })
});

jest.mock('@react-native-firebase/firestore', () => ({}));
jest.mock('@react-native-firebase/storage', () => ({}));

import App from '../App';

it('renders correctly', () => {
    renderer.create(<App/>);
});
