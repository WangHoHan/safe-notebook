import styled from 'styled-components/native';
import {HeaderProps} from './HeaderProps';

export const Header = styled.Text<HeaderProps>`
  color: ${(props: HeaderProps) => props.color || "black"};
  flex: 1;
  font-size: 32px;
`;
