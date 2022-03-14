import React, {useEffect} from 'react';
import * as Keychain from 'react-native-keychain';
import {UserCredentials} from 'react-native-keychain';
import isaac from 'isaac';
import bcrypt from 'react-native-bcrypt';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParams} from '../../navigation/StackParams';
import {Formik, FormikProps, FormikValues} from 'formik';
import {RegistrationFormValues} from './RegistrationFormValues';
import {RegExUtils} from '../../utils/RegExUtils';
import {
    HeaderWrapper,
    ImageWrapper,
    RegistrationForm,
    FormWrapper,
    FormInputWrapper,
    ButtonWrapper
} from './Registration.styled';
import {Header} from '../../components/atom/header/Header.styled';
import {SandBox} from '../../components/atom/sand-box/SandBox.styled';
import {FormInput} from '../../components/atom/form-input/FormInput.styled';
import {ButtonStyled} from '../../components/atom/button/Button.styled';
import {TextStyled} from '../../components/atom/text/Text.styled';
import {ImageStyled} from '../../components/atom/image/Image.styled';
import Toast from 'react-native-toast-message';
import {REGISTRATION_HEADER, REGISTER} from '../../constants/constants';
import {USERNAME} from '../../constants/credentials';

const Registration: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();
    const registrationInitialValues: RegistrationFormValues = {password: '', repeatedPassword: ''};

    useEffect(() => {
        return navigation.addListener('focus', () => {
            const checkCredentials = async (): Promise<void> => {
                try {
                    const userCredentials: UserCredentials | false = await Keychain.getGenericPassword();
                    if (userCredentials && userCredentials.username && userCredentials.password) navigation.navigate('Authorization');
                } catch (e: any) {
                    console.error("Keychain couldn't be accessed!", e);
                }
            };
            checkCredentials()
                .catch((e: any) => console.error(e));
        });
    }, [navigation]);

    const tryToRegister = async (password: string, repeatedPassword: string): Promise<void> => {
        if (password === repeatedPassword) {
            if (RegExUtils.isPasswordValid(password)) {
                await Keychain.resetGenericPassword();
                // @ts-ignore
                bcrypt.setRandomFallback((len: number) => {
                    const buf: Uint8Array = new Uint8Array(len);
                    return buf.map(() => Math.floor(isaac.random() * 256));
                });
                bcrypt.hash(password, 12, async function (e: Error, hash: string | undefined) {
                    if (!e) {
                        if (hash) await Keychain.setGenericPassword(USERNAME, hash);
                        Toast.show({
                            type: 'success',
                            text1: 'credentials have been created',
                            text2: ':)'
                        });
                        navigation.navigate('Authorization');
                    } else console.error(e);
                });
            } else {
                Toast.show({
                    type: 'info',
                    text1: 'your password does not match the pattern',
                    text2: 'password must be at least 20 characters long'
                });
            }
        } else {
            Toast.show({
                type: 'info',
                text1: 'your passwords must be the same',
                text2: 'try again please :)'
            });
        }
    };

    return (
        <SandBox>
            <HeaderWrapper>
                <Header color='white'>{REGISTRATION_HEADER}</Header>
            </HeaderWrapper>
            <ImageWrapper>
                <ImageStyled source={require('../../../assets/images/hand.png')}/>
            </ImageWrapper>
            <RegistrationForm>
                <Formik initialValues={registrationInitialValues}
                        onSubmit={(formikValues: FormikValues, {resetForm}) => {
                            tryToRegister(formikValues.password, formikValues.repeatedPassword)
                                .catch((e: any) => console.error(e));
                            resetForm();
                        }}>
                    {(formikValues: FormikProps<FormikValues>) => (
                        <FormWrapper>
                            <FormInputWrapper>
                                <FormInput width='100%' placeholder='password'
                                           onChangeText={formikValues.handleChange('password')}
                                           value={formikValues.values.password} secureTextEntry={true}/>
                                <FormInput width='100%' placeholder='repeat your password'
                                           onChangeText={formikValues.handleChange('repeatedPassword')}
                                           value={formikValues.values.repeatedPassword} secureTextEntry={true}/>
                            </FormInputWrapper>
                            <ButtonWrapper>
                                <ButtonStyled backgroundColor='yellow' onPress={() => {
                                    formikValues.handleSubmit()
                                }}>
                                    <TextStyled color='blue' fontSize='20px' textAlign='center'>{REGISTER}</TextStyled>
                                </ButtonStyled>
                            </ButtonWrapper>
                        </FormWrapper>
                    )}
                </Formik>
            </RegistrationForm>
        </SandBox>
    );
};

export default Registration;
