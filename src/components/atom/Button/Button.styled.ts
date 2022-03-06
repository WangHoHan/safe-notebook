import styled from 'styled-components/native';
import {ButtonProps} from './ButtonProps';

export const ButtonStyled = styled.Pressable`
  background-color: ${(props: ButtonProps) => props.backgroundColor || "white"};
  flex: ${(props: ButtonProps) => props.flex};
  width: ${(props: ButtonProps) => props.width || '100%'};
  border-radius: 5px;
  justify-content: center;
  padding: 0 20px;
`;
