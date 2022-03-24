import React, {useEffect} from 'react';
import * as Keychain from 'react-native-keychain';
import {BIOMETRY_TYPE, UserCredentials} from 'react-native-keychain';
import {KeyPair, RSA} from 'react-native-rsa-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParams} from '../../navigation/StackParams';
import {USERNAME} from '../../constants/credentials';


const Biometrics: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

    const BiometryTypes = {
        TouchID: 'TouchID',
        FaceID: 'FaceID',
        Fingerprint: 'Fingerprint'
    };

    useEffect(() => {
        const checkCredentials = async (): Promise<void> => {
            Keychain.getSupportedBiometryType()
                .then(async (biometryType: BIOMETRY_TYPE | null) => {
                    switch (biometryType) {
                        case BiometryTypes.FaceID:
                            const userCredentials: UserCredentials | false = await Keychain.getGenericPassword();
                            if (userCredentials && userCredentials.username && userCredentials.password) {
                                navigation.navigate('Notebook', {password: userCredentials.password});
                            } else {
                                RSA.generateKeys(4096)
                                    .then(async (keys: KeyPair) => {
                                        await Keychain.setGenericPassword(USERNAME, keys.private, {
                                            accessControl: 'BiometryCurrentSet' as any,
                                            accessible: 'AccessibleWhenPasscodeSetThisDeviceOnly' as any
                                        });
                                        navigation.navigate('Notebook', {password: keys.private});
                                    })
                                    .catch((e: any) => console.error(e));
                            }
                            break;
                        default:
                            console.error('Biometrics not supported');
                    }
                })
                .catch((e: any) => console.error(e));
        };
        checkCredentials()
            .catch((e: any) => console.error(e));
    }, []);

    return (
        <></>
    );
}

export default Biometrics;
