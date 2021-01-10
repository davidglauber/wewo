/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import 'react-native-gesture-handler';
import React , {useState}from 'react';
import { LogBox } from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';


enableScreens();

// TODO: Remove when fixed
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested',
  'Warning: componentWillReceiveProps has been renamed, and is not recommended',
]);

// import MainNavigatorA or MainNavigatorB to preview design differnces
import MainNavigator from './src/navigation/MainNavigatorA';


// APP
function App() {
  
  return (
    <SafeAreaProvider>
      <MainNavigator/>
    </SafeAreaProvider>
  );
}



export default App;
