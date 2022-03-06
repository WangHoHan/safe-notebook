import React from 'react';
import {Button, TextInput, View} from 'react-native';
import {Formik, FormikProps, FormikValues} from 'formik';
import {SandBox} from '../../components/atom/SandBox/SandBox.styled';
import {Header} from '../../components/atom/Header/Header.styled';
import {AuthorizationForm, Password} from './Authorization.styled';
import {SMILE} from '../../constants/constants';

interface AuthorizationValues {
    password: string
}

const Authorization: React.FC = () => {
    const authorizationInitialValues: AuthorizationValues = {password: ''};
    return (
        <SandBox>
            <Header color='hotpink'>{SMILE}</Header>
            <AuthorizationForm>
                <Formik initialValues={authorizationInitialValues} onSubmit={(formikValues: FormikValues) => {
                    console.log(formikValues);
                }}>
                    {(formikValues: FormikProps<FormikValues>) => (
                        <View>
                            <Password placeholder='my password' onChangeText={formikValues.handleChange('password')}
                                       value={formikValues.values.password} secureTextEntry={true} />
                            <Button title='log in' onPress={() => {formikValues.handleSubmit()}} color='blue' />
                        </View>
                    )}
                </Formik>
            </AuthorizationForm>
        </SandBox>
    );
};

export default Authorization;
