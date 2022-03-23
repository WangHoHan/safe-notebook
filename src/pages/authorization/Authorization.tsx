import React, {useEffect} from 'react';
import {Keyboard, TouchableWithoutFeedback} from 'react-native';
import * as Keychain from 'react-native-keychain';
import {UserCredentials} from 'react-native-keychain';
import bcrypt from 'react-native-bcrypt';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParams} from '../../navigation/StackParams';
import {Formik, FormikProps, FormikValues} from 'formik';
import {AuthorizationFormValues} from './AuthorizationFormValues';
import {
    HeaderWrapper,
    ImageWrapper,
    AuthorizationForm,
    FormWrapper,
    FormInputWrapper,
    ButtonWrapper
} from './Authorization.styled';
import {SandBox} from '../../components/atom/sand-box/SandBox.styled';
import {Header} from '../../components/atom/header/Header.styled';
import {ImageStyled} from '../../components/atom/image/Image.styled';
import {FormInput} from '../../components/atom/form-input/FormInput.styled';
import {ButtonStyled} from '../../components/atom/button/Button.styled';
import {TextStyled} from '../../components/atom/text/Text.styled';
import Toast from 'react-native-toast-message';
import {AUTHORIZATION_HEADER, LOG_IN} from '../../constants/constants';

const Authorization: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();
    const authorizationInitialValues: AuthorizationFormValues = {password: ''};

    let credentials: UserCredentials = {
        username: '',
        password: '',
        service: '',
        storage: ''
    };

    useEffect(() => {
        return navigation.addListener('focus', () => {
            checkCredentials()
                .catch((e: any) => console.error(e));
        });
    }, [navigation]);

    const checkCredentials = async (): Promise<void> => {
        try {
            const userCredentials: UserCredentials | false = await Keychain.getGenericPassword();
            if (userCredentials && userCredentials.username && userCredentials.password) credentials = userCredentials;
            else navigation.navigate('Registration');
        } catch (e: any) {
            console.error("Keychain couldn't be accessed!", e);
        }
    };

    const tryToLogIn = (formPassword: string): void => {
        bcrypt.compare(formPassword, credentials.password, function (e: Error, r: boolean) {
            if (!e) {
                if (r) {
                    navigation.navigate('Notebook', {password: formPassword});
                    credentials = {username: '', password: '', service: '', storage: ''};
                } else {
                    Toast.show({
                        type: 'info',
                        text1: 'you have typed the wrong password',
                        text2: 'try again please :)'
                    });
                }
            } else console.error(e);
        });
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SandBox>
                <HeaderWrapper>
                    <Header color='white'>{AUTHORIZATION_HEADER}</Header>
                </HeaderWrapper>
                <ImageWrapper>
                    <ImageStyled source={require('../../../assets/images/keys.png')}/>
                </ImageWrapper>
                <AuthorizationForm>
                    <Formik initialValues={authorizationInitialValues} onSubmit={(formikValues: FormikValues, {resetForm}) => {
                        tryToLogIn(formikValues.password);
                        resetForm();
                    }}>
                        {(formikValues: FormikProps<FormikValues>) => (
                            <FormWrapper>
                                <FormInputWrapper>
                                    <FormInput width='100%' placeholder='my password'
                                               onChangeText={formikValues.handleChange('password')}
                                               value={formikValues.values.password} secureTextEntry={true}/>
                                </FormInputWrapper>
                                <ButtonWrapper>
                                    <ButtonStyled backgroundColor='yellow' onPress={() => {
                                        formikValues.handleSubmit()
                                    }}>
                                        <TextStyled color='blue' fontSize='20px' textAlign='center'>{LOG_IN}</TextStyled>
                                    </ButtonStyled>
                                </ButtonWrapper>
                            </FormWrapper>
                        )}
                    </Formik>
                </AuthorizationForm>
            </SandBox>
        </TouchableWithoutFeedback>
    );
};

export default Authorization;
