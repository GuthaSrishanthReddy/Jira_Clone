import styled from 'styled-components';

import { color, font } from 'shared/utils/styles';
import { Button, Form } from 'shared/components';

export const FormCont = styled.div`
  display: flex;
  justify-content: center;
`;

export const FormElement = styled(Form.Element)`
  width: 100%;
  max-width: 640px;
`;

export const FormHeading = styled.h1`
  padding: 6px 0 15px;
  ${font.size(24)}
  ${font.medium}
`;

export const ActionButton = styled(Button)`
  margin-top: 30px;
`;

export const SectionDivider = styled.hr`
  margin: 40px 0 0;
  border: none;
  border-top: 1px solid ${color.borderLight};
`;

export const SectionHeading = styled.h2`
  padding: 18px 0 15px;
  ${font.size(20)}
  ${font.medium}
`;

export const TokenHint = styled.p`
  margin-top: 6px;
  color: ${color.textLight};
  ${font.size(12)}
`;
