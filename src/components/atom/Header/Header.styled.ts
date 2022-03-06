import styled from 'styled-components/native';
import {HeaderProps} from './HeaderProps';

export const Header = styled.Text<HeaderProps>`
  color: ${(props: HeaderProps) => props.color || "black"};
  flex: ${(props: HeaderProps) => props.flex};
  font-size: 32px;
  text-shadow: 1px 1px;
`;
