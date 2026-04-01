import styled from 'styled-components';

import { color, font } from 'shared/utils/styles';

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  margin-bottom: 4px;
`;

export const BoardName = styled.h1`
  ${font.size(22)}
  ${font.bold}
  color: ${color.textDark};
  letter-spacing: -0.02em;
`;
