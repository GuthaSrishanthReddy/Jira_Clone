import styled from 'styled-components';

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
  max-width: 760px;
  color: ${color.textMedium};
  ${font.size(15)}
  line-height: 1.6;
`;

export const Hero = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 28px;
  padding: 24px;
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f4f8ff 100%);
  border: 1px solid ${color.borderLightest};
  ${mixin.boxShadowCard}
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const HeroText = styled.div`
  min-width: 0;
`;

export const HeroTitle = styled.h2`
  color: ${color.textDarkest};
  ${font.size(22)}
  ${font.bold}
`;

export const HeroDescription = styled.p`
  margin-top: 8px;
  color: ${color.textMedium};
  ${font.size(14.5)}
  line-height: 1.6;
`;

export const HeroStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(110px, 1fr));
  gap: 12px;
  min-width: 360px;
  @media (max-width: 900px) {
    min-width: 0;
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid ${color.borderLightest};
`;

export const StatLabel = styled.div`
  color: ${color.textLight};
  ${font.size(12)}
  ${font.bold}
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const StatValue = styled.div`
  margin-top: 8px;
  color: ${color.textDarkest};
  ${font.size(24)}
  ${font.bold}
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 24px;
  @media (max-width: 950px) {
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

export const ItemMain = styled.div`
  min-width: 0;
`;

export const ItemTitle = styled.div`
  color: ${color.textDark};
  ${font.size(14)}
  ${font.bold}
`;

export const ItemMeta = styled.div`
  margin-top: 4px;
  color: ${color.textLight};
  ${font.size(12.5)}
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 999px;
  background: ${color.backgroundLightPrimary};
  color: ${color.primary};
  white-space: nowrap;
  ${font.size(12)}
  ${font.bold}
`;

export const EmptyState = styled.div`
  color: ${color.textLight};
  ${font.size(13.5)}
`;
