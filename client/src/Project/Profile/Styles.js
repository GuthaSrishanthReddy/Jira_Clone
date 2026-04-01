import styled from 'styled-components';

import { Avatar } from 'shared/components';
import { color, font, mixin } from 'shared/utils/styles';

export const Page = styled.div`
  width: 100%;
`;

export const Heading = styled.h1`
  padding: 6px 0 8px;
  color: ${color.textDarkest};
  ${font.size(28)}
  ${font.bold}
`;

export const Subheading = styled.p`
  max-width: 720px;
  color: ${color.textMedium};
  ${font.size(15)}
  line-height: 1.6;
`;

export const Hero = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-top: 28px;
  padding: 28px;
  border-radius: 18px;
  background: linear-gradient(135deg, #ffffff 0%, #f4f8ff 100%);
  border: 1px solid ${color.borderLightest};
  ${mixin.boxShadowCard}
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Identity = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

export const ProfileAvatar = styled(Avatar)`
  flex-shrink: 0;
`;

export const IdentityText = styled.div`
  min-width: 0;
`;

export const Name = styled.h2`
  color: ${color.textDarkest};
  ${font.size(24)}
  ${font.bold}
`;

export const Role = styled.div`
  margin-top: 6px;
  color: ${color.primary};
  ${font.size(13)}
  ${font.bold}
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const Email = styled.div`
  margin-top: 8px;
  color: ${color.textMedium};
  ${font.size(14)}
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 24px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  padding: 20px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid ${color.borderLightest};
  ${mixin.boxShadowCard}
`;

export const CardTitle = styled.h3`
  margin-bottom: 14px;
  color: ${color.textDark};
  ${font.size(16)}
  ${font.bold}
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: ${color.backgroundLightest};
`;

export const Label = styled.span`
  color: ${color.textMedium};
  ${font.size(13.5)}
`;

export const Value = styled.span`
  color: ${color.textDark};
  ${font.size(13.5)}
  ${font.bold}
`;

export const Hint = styled.p`
  margin-top: 16px;
  color: ${color.textLight};
  ${font.size(13)}
  line-height: 1.6;
`;
