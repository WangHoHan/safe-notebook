import React, {useEffect} from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParams} from '../../navigation/StackParams';


const Biometrics: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

    useEffect(() => {
        const checkCredentials = async (): Promise<void> => {
            const {biometryType}: any = await ReactNativeBiometrics.isSensorAvailable();
            if (biometryType === ReactNativeBiometrics.FaceID) {
            }
            else console.error('Biometrics not supported');
        };
        checkCredentials()
            .catch((e: any) => console.error(e));
    }, []);

    return (
        <></>
    );
}

export default Biometrics;
