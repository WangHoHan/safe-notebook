import React, {useEffect, useState} from 'react';
import {AsyncStorageService} from '../../services/async-storage-service';
import Toast from 'react-native-toast-message';
import {SandBox} from '../../components/atom/SandBox/SandBox.styled';
import {Header} from '../../components/atom/Header/Header.styled';
import {ButtonStyled} from '../../components/atom/Button/Button.styled';
import {TextStyled} from '../../components/atom/Text/Text.styled';
import {Memo, MemoTextInput} from './Notebook.styled';
import {MEMO_KEY, NOTEPAD, SAVE} from '../../constants/constants';

const Notebook: React.FC = () => {
    const asyncStorageService: AsyncStorageService = new AsyncStorageService();
    const [memo, setMemo] = useState('');

    useEffect(() => {
        const getMemo = async (): Promise<string|null> => {
            return await asyncStorageService.getData(MEMO_KEY);
        }
        getMemo()
            .then((memo: string|null) => {
                if (memo) setMemo(memo);
            }).catch((e: any)=> {
                console.error(e);
                setMemo('');
        });
    }, []);

    const saveMemo = async (): Promise<void> => {
        await asyncStorageService.storeData(MEMO_KEY, memo);
        Toast.show({
            type: 'success',
            text1: 'memo saved',
            text2: ':)'
        });
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
