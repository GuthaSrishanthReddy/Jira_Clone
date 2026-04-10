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

export const SectionCard = styled.section`
  width: 100%;
  max-width: 640px;
`;

export const SectionTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 18px;
`;

export const EditAnchor = styled.a`
  color: ${color.textDarkest};
  ${font.size(13)}
  ${font.medium}
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const SummaryCard = styled.div`
  margin-top: 16px;
  padding: 18px 20px;
  border: 1px solid ${color.borderLight};
  border-radius: 6px;
  background: ${color.backgroundLightest};
`;

export const SummaryList = styled.div`
  display: grid;
  gap: 16px;
`;

export const SummaryItem = styled.div``;

export const SummaryLabel = styled.div`
  margin-bottom: 4px;
  color: ${color.textMedium};
  ${font.size(12)}
  ${font.medium}
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const SummaryValue = styled.div`
  color: ${color.textDarkest};
  ${font.size(15)}
  line-height: 1.5;
  word-break: break-word;
  white-space: pre-wrap;
`;

export const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  width: fit-content;
`;

export const CheckboxInput = styled.input`
  appearance: none;
  width: 18px;
  height: 18px;
  min-width: 18px;
  border: 2px solid ${color.borderLight};
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  position: relative;

  &:checked {
    background: ${color.primary};
    border-color: ${color.primary};
  }

  &:checked::after {
    content: '';
    position: absolute;
    left: 3px;
    top: 0px;
    width: 5px;
    height: 9px;
    border: 2px solid #fff;
    border-top: none;
    border-left: none;
    transform: rotate(45deg);
  }

  &:focus-visible {
    outline: 2px solid ${color.borderInputFocus};
    outline-offset: 2px;
  }
`;

export const CheckboxLabel = styled.span`
  color: ${color.textDark};
  ${font.size(14)}
  ${font.medium}
`;
