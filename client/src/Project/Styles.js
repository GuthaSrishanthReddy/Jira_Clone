import styled from 'styled-components';

import { sizes, color } from 'shared/utils/styles';

const paddingLeft = sizes.appNavBarLeftWidth + sizes.secondarySideBarWidth + 36;

export const ProjectPage = styled.div`
  padding: 28px 36px 56px ${paddingLeft}px;
  min-height: 100vh;
  background: ${color.backgroundLightest};

  @media (max-width: 1100px) {
    padding: 24px 24px 48px ${paddingLeft - 16}px;
  }
  @media (max-width: 999px) {
    padding-left: ${sizes.appNavBarLeftWidth + 20}px;
  }
`;
