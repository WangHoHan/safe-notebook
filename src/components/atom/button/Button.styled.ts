import styled, {css} from 'styled-components/native';
import {ButtonProps} from './ButtonProps';

export const ButtonStyled = styled.Pressable<ButtonProps>`
  ${props => props.backgroundColor && css`
    background-color: ${(props: ButtonProps) => props.backgroundColor};
  `};
  ${props => props.width && css`
    width: ${(props: ButtonProps) => props.width};
  `};
  border-radius: 5px;
  justify-content: center;
  padding: 10px;
`;
