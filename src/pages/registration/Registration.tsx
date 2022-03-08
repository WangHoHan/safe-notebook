import React from 'react';
import {Formik, FormikProps, FormikValues} from 'formik';
import {Header} from '../../components/atom/header/Header.styled';
import {SandBox} from '../../components/atom/sand-box/SandBox.styled';
import {FormInput} from '../../components/atom/form-input/FormInput.styled';
import {ButtonStyled} from '../../components/atom/button/Button.styled';
import {TextStyled} from '../../components/atom/text/Text.styled';
import {ImageStyled} from '../../components/atom/image/Image.styled';
import {HeaderWrapper, ImageWrapper, RegistrationForm, FormWrapper, FormInputWrapper, ButtonWrapper} from './Registration.styled';
import {REGISTRATION_HEADER, REGISTER} from '../../constants/constants';
import {RegistrationFormValues} from './RegistrationFormValues';

const Registration: React.FC = () => {
    const registrationInitialValues: RegistrationFormValues = {password: '', repeatedPassword: ''};

    return (
        <SandBox>
            <HeaderWrapper>
                <Header color='white'>{REGISTRATION_HEADER}</Header>
            </HeaderWrapper>
            <ImageWrapper>
                <ImageStyled source={require('../../../assets/images/pencil.png')}/>
            </ImageWrapper>
            <RegistrationForm>
                <Formik initialValues={registrationInitialValues} onSubmit={(formikValues: FormikValues) => {
                    console.log(formikValues);
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
