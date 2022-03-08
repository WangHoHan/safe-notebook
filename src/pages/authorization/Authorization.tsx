import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParams} from '../../navigation/StackParams';
import * as Keychain from 'react-native-keychain';
import {UserCredentials} from 'react-native-keychain';
import {Formik, FormikProps, FormikValues} from 'formik';
import {SandBox} from '../../components/atom/sand-box/SandBox.styled';
import {Header} from '../../components/atom/header/Header.styled';
import {ImageStyled} from '../../components/atom/image/Image.styled';
import {FormInput} from '../../components/atom/form-input/FormInput.styled';
import {ButtonStyled} from '../../components/atom/button/Button.styled';
import {TextStyled} from '../../components/atom/text/Text.styled';
import {HeaderWrapper, ImageWrapper, AuthorizationForm, FormWrapper, FormInputWrapper, ButtonWrapper} from './Authorization.styled';
import {AuthorizationFormValues} from './AuthorizationFormValues';
import {AUTHORIZATION, LOG_IN} from '../../constants/constants';
import {USERNAME} from '../../constants/credentials';

const Authorization: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();
    const authorizationInitialValues: AuthorizationFormValues = {password: ''};

    useEffect(() => {
        checkCredentials()
            .catch((e: any) => console.log(e));
    }, []);

    const checkCredentials = async (): Promise<void> => {
        try {
            const credentials: UserCredentials | false = await Keychain.getGenericPassword();
            if (credentials) {
                console.log('Credentials successfully loaded for user ' + credentials.username);
            } else {
                console.log('No credentials stored');
            }
        } catch (e) {
            console.error("Keychain couldn't be accessed!", e);
        }
    };

    return (
        <SandBox>
            <HeaderWrapper>
                <Header color='white'>{AUTHORIZATION}</Header>
            </HeaderWrapper>
            <ImageWrapper>
                <ImageStyled source={require('../../../assets/images/key.png')}/>
            </ImageWrapper>
            <AuthorizationForm>
                <Formik initialValues={authorizationInitialValues} onSubmit={(formikValues: FormikValues) => {
                    navigation.navigate('Notebook');
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
    );
};

export default Authorization;
