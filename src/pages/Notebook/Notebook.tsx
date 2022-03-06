import React, {useEffect, useState} from 'react';
import {AsyncStorageService} from '../../services/async-storage-service';
import CryptoJS from 'react-native-crypto-js';
import Toast from 'react-native-toast-message';
import {SandBox} from '../../components/atom/SandBox/SandBox.styled';
import {Header} from '../../components/atom/Header/Header.styled';
import {ButtonStyled} from '../../components/atom/Button/Button.styled';
import {TextStyled} from '../../components/atom/Text/Text.styled';
import {Memo, MemoTextInput} from './Notebook.styled';
import {NOTEPAD, SAVE} from '../../constants/constants';
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

    const saveMemo = async (): Promise<void> => {
        const encryptedMemo: string = CryptoJS.AES.encrypt(memo, 'hello').toString();
        await asyncStorageService.storeData(MEMO_KEY, encryptedMemo);
        Toast.show({
            type: 'success',
            text1: 'memo saved',
            text2: ':)'
        });
    };

    const getEncryptedMemo = async (): Promise<string | null> => {
        const encryptedMemo: string | null =  await asyncStorageService.getData(MEMO_KEY);
        if (encryptedMemo) {
            const bytes: CryptoJS.lib.WordArray = CryptoJS.AES.decrypt(encryptedMemo, 'hello');
            return bytes.toString(CryptoJS.enc.Utf8);
        }
        return null;
    };

    return (
        <SandBox>
            <Header flex={1} color='white'>{NOTEPAD}</Header>
            <Memo>
                <MemoTextInput multiline={true} value={memo} onChangeText={text => setMemo(text)}/>
            </Memo>
            <ButtonStyled flex={0.8} backgroundColor='yellow' width='95%' onPress={saveMemo}>
                <TextStyled color='blue' fontSize='20px'>{SAVE}</TextStyled>
            </ButtonStyled>
        </SandBox>
    );
};

export default Notebook;
