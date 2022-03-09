import React, {useEffect, useState} from 'react';
import * as Keychain from 'react-native-keychain';
import {UserCredentials} from 'react-native-keychain';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParams} from '../../navigation/StackParams';
import {Formik, FormikProps, FormikValues} from 'formik';
import {ChangeCredentialsFormValues} from './ChangeCredentialsFormValues';
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
import {USERNAME} from '../../constants/credentials';

const ChangeCredentials: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();
    const changeCredentialsInitialValues: ChangeCredentialsFormValues = {
        myPassword: '',
        newPassword: '',
        repeatedNewPassword: ''
    };

    const [credentials, setCredentials] = useState<UserCredentials>({
        username: '',
        password: '',
        service: '',
        storage: ''
    });

    useEffect(() => {
        return navigation.addListener('focus', () => {
            const checkCredentials = async (): Promise<void> => {
                try {
                    const credentials: UserCredentials | false = await Keychain.getGenericPassword();
                    if (credentials && credentials.username && credentials.password) {
                        setCredentials(credentials);
                    } else {
                        navigation.navigate('Registration');
                        setCredentials({username: '', password: '', service: '', storage: ''});
                    }
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
            if (myPassword === credentials.password) {
                if (newPassword === repeatedNewPassword) {
                    if (RegExUtils.isPasswordValid(newPassword)) {
                        await Keychain.resetGenericPassword();
                        await Keychain.setGenericPassword(USERNAME, newPassword);
                        Toast.show({
                            type: 'success',
                            text1: 'credentials have been changed',
                            text2: ':)'
                        });
                        navigation.navigate('Authorization');
                        setCredentials({username: '', password: '', service: '', storage: ''});
                    } else {
                        Toast.show({
                            type: 'info',
                            text1: 'your new password does not match the pattern',
                            text2: 'at least: 8 chars, 1 up, 1 low letter, 1 num, 1 special char'
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
        } catch (e: any) {
            console.error("Keychain couldn't be accessed!", e);
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