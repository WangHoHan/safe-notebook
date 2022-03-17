import React, {useEffect, useState} from 'react';
import bcrypt from 'react-native-bcrypt';
import {Buffer} from 'buffer';
import pbkdf2 from 'pbkdf2';
import CryptoJS from 'react-native-crypto-js';
import {NativeStackScreenProps} from 'react-native-screens/native-stack';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParams} from '../../navigation/StackParams';
import {AsyncStorageService} from '../../services/AsyncStorageService';
import {HeaderWrapper, ChangeCredentials, Memo, MemoTextInput, ButtonWrapper} from './Notebook.styled';
import {SandBox} from '../../components/atom/sand-box/SandBox.styled';
import {Header} from '../../components/atom/header/Header.styled';
import {ButtonStyled} from '../../components/atom/button/Button.styled';
import {TextStyled} from '../../components/atom/text/Text.styled';
import Toast from 'react-native-toast-message';
import {NOTEPAD_HEADER, CHANGE_CREDENTIALS, SAVE} from '../../constants/constants';
import {MEMO_KEY, KEY_SALT} from '../../constants/credentials';

type NotebookProps = NativeStackScreenProps<StackParams, 'Notebook'>;

const Notebook: React.FC<NotebookProps> = ({route}: NotebookProps) => {
    let password: string = route.params.password;
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();
    const asyncStorageService: AsyncStorageService = new AsyncStorageService();

    const [key, setKey] = useState<string>('');
    const [memo, setMemo] = useState<string>('');

    useEffect(() => {
        return navigation.addListener('focus', () => {
            getEncryptedMemo()
                .catch((e: any) => console.error(e));
        });
    }, [navigation]);

    const getEncryptedMemo = async (): Promise<void> => {
        const encryptedMemo: string | null = await asyncStorageService.getData(MEMO_KEY);
        if (encryptedMemo) {
            const keySalt: string | null = await asyncStorageService.getData(KEY_SALT);
            if (keySalt) {
                pbkdf2.pbkdf2(password, keySalt, 100000, 64, 'sha512',  (err: Error, derivedKey: Buffer) => {
                    if (!err) {
                        setKey(derivedKey.toString('hex'));
                        const bytes: CryptoJS.lib.WordArray = CryptoJS.AES.decrypt(encryptedMemo, derivedKey.toString('hex'));
                        setMemo(bytes.toString(CryptoJS.enc.Utf8));
                    } else console.error(err);
                });
            }
        }
    };

    const saveMemo = async (): Promise<void> => {
        bcrypt.genSalt(10, function(e: Error, salt: string | undefined) {
            if (!e) {
                if (salt) {
                    asyncStorageService.storeData(KEY_SALT, salt);
                    pbkdf2.pbkdf2(password, salt, 100000, 64, 'sha512', async (err: Error, derivedKey: Buffer) => {
                        if (!err) {
                            // cipher block chaining mode, Pkcs7 padding, iv and salt is random every time for the same memo
                            const encryptedMemo: string = CryptoJS.AES.encrypt(memo, derivedKey.toString('hex')).toString();
                            await asyncStorageService.storeData(MEMO_KEY, encryptedMemo);
                            Toast.show({
                                type: 'success',
                                text1: 'memo saved',
                                text2: ':)'
                            });
                            navigation.navigate('Authorization');
                            setKey('');
                            password = '';
                        } else console.error(err);
                    });
                }
            } else console.error(e);
        });
    };

    return (
        <SandBox>
            <HeaderWrapper>
                <Header color='white'>{NOTEPAD_HEADER}</Header>
            </HeaderWrapper>
            <ChangeCredentials>
                <ButtonStyled backgroundColor='pink'>
                    <TextStyled color='darkred' fontSize='10px' textAlign='center' onPress={() => {
                        navigation.navigate('ChangeCredentials', {key: key});
                    }}>{CHANGE_CREDENTIALS}</TextStyled>
                </ButtonStyled>
            </ChangeCredentials>
            <Memo>
                <MemoTextInput autoCapitalize='none' multiline={true} value={memo}
                               onChangeText={text => setMemo(text)}/>
            </Memo>
            <ButtonWrapper>
                <ButtonStyled backgroundColor='yellow' width='95%' onPress={saveMemo}>
                    <TextStyled color='blue' fontSize='20px' textAlign='center'>{SAVE}</TextStyled>
                </ButtonStyled>
            </ButtonWrapper>
        </SandBox>
    );
};

export default Notebook;
