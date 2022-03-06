import styled from 'styled-components/native';
import {TextProps} from './TextProps';

export const TextStyled = styled.Text<TextProps>`
  color: ${(props: TextProps) => props.color || "black"};
  font-size: ${(props: TextProps) => props.fontSize || "16px"};
  text-align: center;
`;
