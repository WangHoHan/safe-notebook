import React, {useEffect, useState} from 'react';
import {AsyncStorageService} from '../../services/AsyncStorageService';
import CryptoJS from 'react-native-crypto-js';
import Toast from 'react-native-toast-message';
import {HeaderWrapper, ChangeCredentials, Memo, MemoTextInput, ButtonWrapper} from './Notebook.styled';
import {SandBox} from '../../components/atom/sand-box/SandBox.styled';
import {Header} from '../../components/atom/header/Header.styled';
import {ButtonStyled} from '../../components/atom/button/Button.styled';
import {TextStyled} from '../../components/atom/text/Text.styled';
import {NOTEPAD_HEADER, CHANGE_CREDENTIALS, SAVE} from '../../constants/constants';
import {MEMO_KEY} from '../../constants/credentials';

const Notebook: React.FC = () => {
    const asyncStorageService: AsyncStorageService = new AsyncStorageService();
    const [memo, setMemo] = useState('');

    useEffect(() => {
        getEncryptedMemo()
            .then((decryptedMemo: string | null) => {
                if (decryptedMemo) setMemo(decryptedMemo);
            })
            .catch((e: any) => console.error(e));
    }, []);

    const getEncryptedMemo = async (): Promise<string | null> => {
        const encryptedMemo: string | null =  await asyncStorageService.getData(MEMO_KEY);
        if (encryptedMemo) {
            const bytes: CryptoJS.lib.WordArray = CryptoJS.AES.decrypt(encryptedMemo, 'hello');
            return bytes.toString(CryptoJS.enc.Utf8);
        }
        return null;
    };

    const saveMemo = async (): Promise<void> => {
        const encryptedMemo: string = CryptoJS.AES.encrypt(memo, 'hello').toString();
        await asyncStorageService.storeData(MEMO_KEY, encryptedMemo);
        Toast.show({
            type: 'success',
            text1: 'memo saved',
            text2: ':)'
        });
    };

    return (
        <SandBox>
            <HeaderWrapper>
                <Header color='white'>{NOTEPAD_HEADER}</Header>
            </HeaderWrapper>
            <ChangeCredentials>
                <ButtonStyled backgroundColor='pink'>
                    <TextStyled color='darkred' fontSize='10px' textAlign='center'>{CHANGE_CREDENTIALS}</TextStyled>
                </ButtonStyled>
            </ChangeCredentials>
            <Memo>
                <MemoTextInput multiline={true} value={memo} onChangeText={text => setMemo(text)}/>
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
