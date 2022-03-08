import styled, {css} from 'styled-components/native';
import {FormInputProps} from './FormInputProps';

export const FormInput = styled.TextInput<FormInputProps>`
  ${props => props.width && css`
    width: ${(props: FormInputProps) => props.width};
  `};
  background-color: lightyellow;
  border-radius: 5px;
  padding: 20px;
  text-align: center;
`;
