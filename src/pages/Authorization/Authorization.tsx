import React, {useEffect} from 'react';
import * as Keychain from 'react-native-keychain';
import {UserCredentials} from 'react-native-keychain';
import {Formik, FormikProps, FormikValues} from 'formik';
import {SandBox} from '../../components/atom/SandBox/SandBox.styled';
import {Header} from '../../components/atom/Header/Header.styled';
import {ImageStyled} from '../../components/atom/Image/Image.styled';
import {FormInput} from '../../components/atom/FormInput/FormInput.styled';
import {ButtonStyled} from '../../components/atom/Button/Button.styled';
import {TextStyled} from '../../components/atom/Text/Text.styled';
import {ImageWrapper, AuthorizationForm, FormWrapper} from './Authorization.styled';
import {AuthorizationFormValues} from './AuthorizationFormValues';
import {AUTHORIZATION, LOG_IN} from '../../constants/constants';
import {USERNAME} from '../../constants/credentials';

const Authorization: React.FC = () => {
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
        } catch (error) {
            console.log("Keychain couldn't be accessed!", error);
        }
    };

    return (
        <SandBox>
            <Header flex={5} color='white'>{AUTHORIZATION}</Header>
            <ImageWrapper>
                <ImageStyled source={require('../../../assets/images/key.png')}/>
            </ImageWrapper>
            <AuthorizationForm>
                <Formik initialValues={authorizationInitialValues} onSubmit={(formikValues: FormikValues) => {
                    console.log(formikValues);
                }}>
                    {(formikValues: FormikProps<FormikValues>) => (
                        <FormWrapper>
                            <FormInput flex={1} placeholder='my password'
                                       onChangeText={formikValues.handleChange('password')}
                                       value={formikValues.values.password} secureTextEntry={true}/>
                            <ButtonStyled flex={2} backgroundColor='yellow' onPress={() => {
                                formikValues.handleSubmit()
                            }}>
                                <TextStyled color='blue' fontSize='20px'>{LOG_IN}</TextStyled>
                            </ButtonStyled>
                        </FormWrapper>
                    )}
                </Formik>
            </AuthorizationForm>
        </SandBox>
    );
};

export default Authorization;
