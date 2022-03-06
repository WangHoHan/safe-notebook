import React from 'react';
import Toast from 'react-native-toast-message';
import Authorization from './src/pages/Authorization/Authorization';
import Notebook from './src/pages/Notebook/Notebook';

export default function App() {
  return (
      <>
        <Authorization />
        {/*<Notebook />*/}
        <Toast />
      </>
  );
};
