import React from 'react';
import {Button} from 'react-native';
import {SandBox} from '../../components/atom/SandBox/SandBox.styled';
import {Header} from '../../components/atom/Header/Header.styled';
import {Memo, MemoTypeArea} from './Notebook.styled';
import {MY_MEMO, SAVE_MEMO} from '../../constants/constants';

const Notebook: React.FC = () => {
    return (
        <SandBox>
            <Header color='hotpink'>{MY_MEMO}</Header>
            <Memo>
                <MemoTypeArea multiline={true}>hello</MemoTypeArea>
            </Memo>
            <Button title={SAVE_MEMO} onPress={() => {}} color='blue' />
        </SandBox>
    );
};

export default Notebook;
