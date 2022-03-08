import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StackParams} from './StackParams';
import Authorization from '../pages/authorization/Authorization';
import Registration from '../pages/registration/Registration';
import Notebook from '../pages/notebook/Notebook';

const Stack = createNativeStackNavigator<StackParams>();

export default function Navigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Authorization'>
                <Stack.Screen name='Authorization' component={Authorization} options={{headerShown: false}}/>
                <Stack.Screen name='Registration' component={Registration} options={{headerShown: false}}/>
                <Stack.Screen name='Notebook' component={Notebook} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};
