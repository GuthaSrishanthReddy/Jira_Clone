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

export const Feed = styled.div`
  display: grid;
  gap: 16px;
  margin-top: 28px;
`;

export const FeedCard = styled.div`
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 18px;
  padding: 18px 20px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid ${color.borderLightest};
  ${mixin.boxShadowCard}
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

export const FeedDate = styled.div`
  color: ${color.textLight};
  ${font.size(12.5)}
  ${font.bold}
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const FeedBody = styled.div`
  min-width: 0;
`;

export const FeedTitle = styled.div`
  color: ${color.textDark};
  ${font.size(15)}
  ${font.bold}
`;

export const FeedMeta = styled.div`
  margin-top: 6px;
  color: ${color.textMedium};
  ${font.size(13.5)}
  line-height: 1.6;
`;

export const FeedTags = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
`;

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  background: ${color.backgroundLightPrimary};
  color: ${color.primary};
  ${font.size(12)}
  ${font.bold}
`;
