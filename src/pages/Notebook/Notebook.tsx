import React from 'react';
import {SandBox} from '../../components/atom/SandBox/SandBox.styled';
import {Header} from '../../components/atom/Header/Header.styled';
import {ButtonStyled} from '../../components/atom/Button/Button.styled';
import {TextStyled} from '../../components/atom/Text/Text.styled';
import {Memo, MemoTextInput} from './Notebook.styled';
import {NOTEPAD, SAVE} from '../../constants/constants';

const Notebook: React.FC = () => {
    return (
        <SandBox>
            <Header flex={1} color='white'>{NOTEPAD}</Header>
            <Memo>
                <MemoTextInput multiline={true} value='hello'/>
            </Memo>
            <ButtonStyled flex={0.8} backgroundColor='yellow' width='95%' onPress={() => {
            }}><TextStyled color='blue' fontSize='20px'>{SAVE}</TextStyled></ButtonStyled>
        </SandBox>
    );
};

export default Notebook;
