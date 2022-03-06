import styled from 'styled-components/native';
import {FormInputProps} from './FormInputProps';

export const FormInput = styled.TextInput<FormInputProps>`
  flex: ${(props: FormInputProps) => props.flex};
  background-color: lightyellow;
  border-radius: 5px;
  margin: 20px 0;
  padding: 10px;
  text-align: center;
  width: 100%;
`;
