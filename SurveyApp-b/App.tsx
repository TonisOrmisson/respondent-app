import React from 'react';
import { StatusBar } from 'react-native';
import { AppNavigator } from './src/navigation';

function App(): React.JSX.Element {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      <AppNavigator />
    </>
  );
}

export default App;
