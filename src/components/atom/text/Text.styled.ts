import styled, {css} from 'styled-components/native';
import {TextProps} from './TextProps';

export const TextStyled = styled.Text<TextProps>`
  ${props => props.color && css`
    color: ${(props: TextProps) => props.color};
  `};
  ${props => props.fontSize && css`
    font-size: ${(props: TextProps) => props.fontSize};
  `};
  ${props => props.textAlign && css`
    text-align: ${(props: TextProps) => props.textAlign};
  `};
  font-family: 'Courier';
`;
