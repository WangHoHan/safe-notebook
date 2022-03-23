import React, {useEffect} from 'react';
import * as Keychain from 'react-native-keychain';
import {UserCredentials} from 'react-native-keychain';
import isaac from 'isaac';
import bcrypt from 'react-native-bcrypt';
import pbkdf2 from 'pbkdf2';
import {Buffer} from 'buffer';
import CryptoJS from 'react-native-crypto-js';
import {NativeStackScreenProps} from 'react-native-screens/native-stack';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParams} from '../../navigation/StackParams';
import {Formik, FormikProps, FormikValues} from 'formik';
import {ChangeCredentialsFormValues} from './ChangeCredentialsFormValues';
import {AsyncStorageService} from '../../services/AsyncStorageService';
import {RegExUtils} from '../../utils/RegExUtils';
import {
    HeaderWrapper,
    BackWrapper,
    ImageWrapper,
    ChangeCredentialsForm,
    FormWrapper,
    FormInputWrapper,
    ButtonWrapper
} from './ChangeCredentials.styled';
import {SandBox} from '../../components/atom/sand-box/SandBox.styled';
import {Header} from '../../components/atom/header/Header.styled';
import {ImageStyled} from '../../components/atom/image/Image.styled';
import {FormInput} from '../../components/atom/form-input/FormInput.styled';
import {ButtonStyled} from '../../components/atom/button/Button.styled';
import {TextStyled} from '../../components/atom/text/Text.styled';
import Toast from 'react-native-toast-message';
import {CHANGE_CREDENTIALS_HEADER, BACK, CHANGE} from '../../constants/constants';
import {KEY_SALT, MEMO_KEY, USERNAME} from '../../constants/credentials';

type ChangeCredentialsProps = NativeStackScreenProps<StackParams, 'ChangeCredentials'>;

const ChangeCredentials: React.FC<ChangeCredentialsProps> = ({route}: ChangeCredentialsProps) => {
    let key: string  = route.params.key;
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();
    const asyncStorageService: AsyncStorageService = new AsyncStorageService();
    const changeCredentialsInitialValues: ChangeCredentialsFormValues = {
        myPassword: '',
        newPassword: '',
        repeatedNewPassword: ''
    };

    let credentials: UserCredentials = {
        username: '',
        password: '',
        service: '',
        storage: ''
    };

    useEffect(() => {
        return navigation.addListener('focus', () => {
            const checkCredentials = async (): Promise<void> => {
                try {
                    const userCredentials: UserCredentials | false = await Keychain.getGenericPassword();
                    if (userCredentials && userCredentials.username && userCredentials.password) credentials = userCredentials;
                    else navigation.navigate('Registration');
                } catch (e: any) {
                    console.error("Keychain couldn't be accessed!", e);
                }
            };
            checkCredentials()
                .catch((e: any) => console.error(e));
        });
    }, [navigation]);

    const tryToChangeCredentials  = async (myPassword: string, newPassword: string, repeatedNewPassword: string): Promise<void> => {
        try {
            bcrypt.compare(myPassword, credentials.password, async function (e: Error, r: boolean) {
                if (!e) {
                    if (r) {
                        if (newPassword === repeatedNewPassword) {
                            if (RegExUtils.isPasswordValid(newPassword)) {
                                await Keychain.resetGenericPassword();
                                // @ts-ignore
                                bcrypt.setRandomFallback((len: number) => {
                                    const buf: Uint8Array = new Uint8Array(len);
                                    return buf.map(() => Math.floor(isaac.random() * 256));
                                });
                                bcrypt.hash(newPassword, 12, async function(e: Error, hash: string | undefined) {
                                    if (!e) {
                                        if (hash) await Keychain.setGenericPassword(USERNAME, hash);
                                        bcrypt.genSalt(10, function(e: Error, salt: string | undefined) {
                                            if (!e) {
                                                if (salt) {
                                                    asyncStorageService.storeData(KEY_SALT, salt);
                                                    pbkdf2.pbkdf2(newPassword, salt, 1000, 64, 'sha512', (err: Error, derivedKey: Buffer) => {
                                                        if (!err) {
                                                            encryptMemoWithNewKey(key, derivedKey.toString('hex'))
                                                                .catch((e: any) => console.error(e));
                                                            Toast.show({
                                                                type: 'success',
                                                                text1: 'credentials have been changed',
                                                                text2: ':)'
                                                            });
                                                            navigation.navigate('Authorization');
                                                            credentials = {username: '', password: '', service: '', storage: ''};
                                                            key = '';
                                                        } else console.error(err);
                                                    });
                                                }
                                            } else console.error(e);
                                        });
                                    } else console.error(e);
                                });
                            } else {
                                Toast.show({
                                    type: 'info',
                                    text1: 'your new password does not match the pattern',
                                    text2: 'password must be at least 20 characters long'
                                });
                            }
                        } else {
                            Toast.show({
                                type: 'info',
                                text1: 'your new passwords must be the same',
                                text2: 'try again please :)'
                            });
                        }
                    } else {
                        Toast.show({
                            type: 'info',
                            text1: 'you have typed the wrong current password',
                            text2: 'try again please :)'
                        });
                    }
                } else console.error(e);
            });
        } catch (e: any) {
            console.error("Keychain couldn't be accessed!", e);
        }
    };

    const encryptMemoWithNewKey = async (myKey: string, newKey: string):Promise<void> => {
        const encryptedMemo: string | null = await asyncStorageService.getData(MEMO_KEY);
        if (encryptedMemo) {
            const bytes: CryptoJS.lib.WordArray = CryptoJS.AES.decrypt(encryptedMemo, myKey);
            const decryptedMemo: string =  bytes.toString(CryptoJS.enc.Utf8);
            // cipher block chaining mode, Pkcs7 padding
            const encryptedMemoOnceAgain: string = CryptoJS.AES.encrypt(decryptedMemo, newKey).toString();
            await asyncStorageService.storeData(MEMO_KEY, encryptedMemoOnceAgain);
        }
    };

    return (
        <SandBox>
            <HeaderWrapper>
                <Header color='white'>{CHANGE_CREDENTIALS_HEADER}</Header>
            </HeaderWrapper>
            <BackWrapper>
                <ButtonStyled backgroundColor='pink'>
                    <TextStyled color='darkred' fontSize='10px' textAlign='center' onPress={() => {
                        navigation.goBack();
                    }}>{BACK}</TextStyled>
                </ButtonStyled>
            </BackWrapper>
            <ImageWrapper>
                <ImageStyled source={require('../../../assets/images/eyes.png')}/>
            </ImageWrapper>
            <ChangeCredentialsForm>
                <Formik initialValues={changeCredentialsInitialValues} onSubmit={(formikValues: FormikValues, {resetForm}) => {
                    tryToChangeCredentials(formikValues.myPassword, formikValues.newPassword, formikValues.repeatedNewPassword)
                        .catch((e: any) => console.error(e));
                    resetForm();
                }}>
                    {(formikValues: FormikProps<FormikValues>) => (
                        <FormWrapper>
                            <FormInputWrapper>
                                <FormInput width='100%' placeholder='my password'
                                           onChangeText={formikValues.handleChange('myPassword')}
                                           value={formikValues.values.myPassword} secureTextEntry={true}/>
                                <FormInput width='100%' placeholder='new password'
                                           onChangeText={formikValues.handleChange('newPassword')}
                                           value={formikValues.values.newPassword} secureTextEntry={true}/>
                                <FormInput width='100%' placeholder='repeat your new password'
                                           onChangeText={formikValues.handleChange('repeatedNewPassword')}
                                           value={formikValues.values.repeatedNewPassword} secureTextEntry={true}/>
                            </FormInputWrapper>
                            <ButtonWrapper>
                                <ButtonStyled backgroundColor='yellow' onPress={() => {
                                    formikValues.handleSubmit()
                                }}>
                                    <TextStyled color='blue' fontSize='20px' textAlign='center'>{CHANGE}</TextStyled>
                                </ButtonStyled>
                            </ButtonWrapper>
                        </FormWrapper>
                    )}
                </Formik>
            </ChangeCredentialsForm>
        </SandBox>
    );
};

export default ChangeCredentials;