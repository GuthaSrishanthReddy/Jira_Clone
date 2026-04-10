import styled from 'styled-components';

import { color, font, mixin } from 'shared/utils/styles';

export const Page = styled.div`
  width: 100%;
`;

export const Heading = styled.h1`
  padding: 6px 0 8px;
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

export const HeroTitle = styled.h2`
  ${font.size(22)}
  ${font.bold}
  color: ${color.textDark};
`;

export const HeroText = styled.p`
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

export const Section = styled.section`
  margin-top: 28px;
`;

export const SectionTitle = styled.h3`
  margin-bottom: 14px;
  ${font.size(18)}
  ${font.bold}
  color: ${color.textDark};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 18px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  padding: 18px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid ${color.borderLightest};
  ${mixin.boxShadowCard}
`;

export const CardTitle = styled.h4`
  margin-bottom: 12px;
  ${font.size(16)}
  ${font.bold}
  color: ${color.textDark};
`;

export const CardBody = styled.div`
  color: ${color.textMedium};
  ${font.size(14)}
  line-height: 1.6;
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

export const SelectableListItem = styled(ListItem)`
  width: 100%;
  border: 1px solid transparent;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background: #f3f7ff;
    border-color: ${color.primary};
    transform: translateY(-1px);
  }

  ${({ $isActive }) =>
    $isActive &&
    `
      background: #edf4ff;
      border-color: ${color.primary};
    `}
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

export const MutedText = styled.div`
  color: ${color.textLight};
  ${font.size(13.5)}
`;

export const TeamList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TeamMember = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const TeamMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const InlineMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  & > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const DetailCard = styled.div`
  margin-top: 16px;
  padding: 16px;
  border-radius: 12px;
  background: linear-gradient(180deg, #fbfdff 0%, #f4f8ff 100%);
  border: 1px solid ${color.borderLightest};
`;

export const DetailHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const DetailTitle = styled.h5`
  color: ${color.textDark};
  ${font.size(15)}
  ${font.bold}
`;

export const DetailDescription = styled.p`
  margin-top: 4px;
  color: ${color.textMedium};
  ${font.size(13)}
  line-height: 1.5;
`;

export const DetailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 14px;
`;

export const DetailListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid ${color.borderLightest};
`;

export const DetailPrimary = styled.div`
  min-width: 0;
`;

export const DetailTitleText = styled.div`
  color: ${color.textDarkest};
  ${font.size(13.5)}
  ${font.bold}
`;

export const DetailMeta = styled.div`
  margin-top: 4px;
  color: ${color.textMedium};
  ${font.size(12.5)}
`;

export const DetailEmpty = styled.div`
  padding: 12px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px dashed ${color.borderLight};
  color: ${color.textMedium};
  ${font.size(13)}
`;
