import styled, {css} from 'styled-components/native';
import {HeaderProps} from './HeaderProps';

export const Header = styled.Text<HeaderProps>`
  ${props => props.color && css`
    color: ${(props: HeaderProps) => props.color};
  `};
  font-size: 32px;
  text-shadow: 1px 1px;
`;
