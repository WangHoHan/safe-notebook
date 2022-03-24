export type StackParams = {
    Authorization: object | undefined,
    Biometrics: object | undefined,
    ChangeCredentials: {
        key: string
    },
    Notebook: {
        password: string;
    },
    Registration: object | undefined
};
