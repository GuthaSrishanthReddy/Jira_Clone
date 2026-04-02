import styled from 'styled-components';

import { color, font } from 'shared/utils/styles';
import { Button, Form } from 'shared/components';

export const FormElement = styled(Form.Element)`
  padding: 25px 40px 35px;
`;

export const FormHeading = styled.div`
  padding-bottom: 15px;
  ${font.size(21)}
`;

export const SelectItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 15px;
  ${props => props.$withBottomMargin && `margin-bottom: 5px;`}
`;

export const SelectItemLabel = styled.div`
  padding: 0 3px 0 6px;
`;

export const Divider = styled.div`
  margin-top: 22px;
  border-top: 1px solid ${color.borderLightest};
`;

export const AIActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

export const AIHint = styled.div`
  color: ${color.textLight};
  ${font.size(12.5)}
  line-height: 1.5;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 30px;
`;

export const ActionButton = styled(Button)`
  margin-left: 10px;
`;
