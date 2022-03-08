import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import Authorization from './src/pages/Authorization/Authorization';
import Notebook from './src/pages/Notebook/Notebook';

export type StackParams = {
    Authorization: object|undefined,
    Notebook: object|undefined
};

const Stack = createNativeStackNavigator<StackParams>();

export default function App() {
  return (
      <>
          <NavigationContainer>
              <Stack.Navigator initialRouteName='Authorization'>
                  <Stack.Screen name='Authorization' component={Authorization} options={{headerShown: false}}/>
                  <Stack.Screen name='Notebook' component={Notebook} options={{headerShown: false}}/>
              </Stack.Navigator>
          </NavigationContainer>
          <Toast />
      </>
  );
};
