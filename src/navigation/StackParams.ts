import {UserCredentials} from 'react-native-keychain';

export type StackParams = {
    Authorization: object | undefined,
    ChangeCredentials: object | undefined,
    Notebook: {
        credentials: UserCredentials;
    },
    Registration: object | undefined
};
