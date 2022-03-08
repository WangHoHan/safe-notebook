import React from 'react';
import {Formik, FormikProps, FormikValues} from 'formik';
import {ChangeCredentialsFormValues} from './ChangeCredentialsFormValues';
import {
    HeaderWrapper,
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
import {CHANGE_CREDENTIALS_HEADER, CHANGE} from '../../constants/constants';

const ChangeCredentials: React.FC = () => {
    const changeCredentialsInitialValues: ChangeCredentialsFormValues = {
        myPassword: '',
        newPassword: '',
        repeatedNewPassword: ''
    };

    return (
        <SandBox>
            <HeaderWrapper>
                <Header color='white'>{CHANGE_CREDENTIALS_HEADER}</Header>
            </HeaderWrapper>
            <ImageWrapper>
                <ImageStyled source={require('../../../assets/images/eyes.png')}/>
            </ImageWrapper>
            <ChangeCredentialsForm>
                <Formik initialValues={changeCredentialsInitialValues} onSubmit={(formikValues: FormikValues) => {
                    console.log(formikValues);
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