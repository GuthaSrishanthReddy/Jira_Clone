import styled from 'styled-components';

import { color, font, mixin } from 'shared/utils/styles';

export const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #eaf2ff 100%);
`;

export const Topbar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 28px;
  background: #ffffff;
  border-bottom: 1px solid ${color.borderLightest};
  @media (max-width: 980px) {
    flex-wrap: wrap;
    padding: 16px 20px;
  }
`;

export const Brand = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: ${color.textDarkest};
  ${font.size(18)}
  ${font.bold}
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 26px;
  @media (max-width: 980px) {
    order: 3;
    width: 100%;
    flex-wrap: wrap;
    gap: 14px 18px;
  }
`;

export const NavLink = styled.a`
  color: ${color.textDark};
  ${font.size(14.5)}
  ${font.medium}
  &:hover {
    color: ${color.primary};
  }
`;

export const TopbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const SearchButton = styled.button`
  color: ${color.textDark};
  ${font.size(14)}
  ${font.medium}
`;

export const SignInLink = styled.a`
  color: ${color.primary};
  ${font.size(14.5)}
  ${font.bold}
`;

export const Announcement = styled.div`
  padding: 14px 24px;
  background: #dbeafe;
  border-bottom: 1px solid ${color.borderLightest};
`;

export const AnnouncementText = styled.div`
  text-align: center;
  color: ${color.textDark};
  ${font.size(14.5)}
  ${font.medium}
`;

export const Hero = styled.main`
  padding: 56px 28px 40px;
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(320px, 1fr) minmax(320px, 460px);
  gap: 36px;
  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    padding: 36px 20px 28px;
  }
`;

export const HeroCopy = styled.section`
  padding-top: 44px;
`;

export const HeroEyebrow = styled.div`
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  background: #dbeafe;
  color: ${color.primary};
  ${font.size(11.5)}
  ${font.bold}
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const HeroTitle = styled.h1`
  margin-top: 18px;
  color: ${color.textDarkest};
  ${font.size(58)}
  line-height: 1.06;
  letter-spacing: -0.04em;
  span {
    ${font.black}
  }
  @media (max-width: 980px) {
    ${font.size(42)}
  }
`;

export const HeroText = styled.p`
  margin-top: 22px;
  max-width: 560px;
  color: ${color.textDark};
  ${font.size(18)}
  line-height: 1.6;
`;

export const HeroActions = styled.div`
  display: flex;
  gap: 14px;
  margin-top: 28px;
  flex-wrap: wrap;
`;

export const LoginCard = styled.section`
  padding: 28px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid ${color.borderLightest};
  ${mixin.boxShadowMedium}
`;

export const LoginTitle = styled.h2`
  color: ${color.textDarkest};
  ${font.size(28)}
  ${font.bold}
`;

export const LoginText = styled.p`
  margin-top: 8px;
  color: ${color.textMedium};
  ${font.size(14.5)}
  line-height: 1.6;
`;

export const LoginForm = styled.form`
  margin-top: 20px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5));
  display: grid;
  gap: 14px;
`;

export const InputWrap = styled.div`
  display: grid;
  gap: 8px;
`;

export const Separator = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0 16px;
`;

export const SeparatorLine = styled.div`
  flex: 1;
  height: 1px;
  background: ${color.borderLight};
`;

export const SeparatorText = styled.span`
  color: ${color.textLight};
  ${font.size(12.5)}
  ${font.medium}
`;

export const ShowcaseRow = styled.section`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px;
  margin-top: 8px;
  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const ShowcaseCard = styled.article`
  padding: 18px;
  min-height: 320px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid ${color.borderLightest};
  ${mixin.boxShadowCard}
`;

export const ShowcaseTag = styled.div`
  display: inline-flex;
  padding: 5px 8px;
  border-radius: 999px;
  background: ${props =>
    ({
      green: '#ecfccb',
      purple: '#f3e8ff',
      amber: '#fef3c7',
    }[props.$tone] || '#dbeafe')};
  color: ${props =>
    ({
      green: '#4d7c0f',
      purple: '#7e22ce',
      amber: '#b45309',
    }[props.$tone] || '#1d4ed8')};
  ${font.size(10.5)}
  ${font.bold}
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const ShowcaseTitle = styled.h3`
  margin-top: 14px;
  color: ${color.textDarkest};
  ${font.size(22)}
  line-height: 1.15;
`;

export const ShowcaseMock = styled.div`
  margin-top: 22px;
  height: 190px;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid ${color.borderLightest};
  padding: 16px;
`;

export const ShowcaseDarkMock = styled(ShowcaseMock)`
  background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
  border: none;
`;

export const ShowcaseList = styled.div`
  display: grid;
  gap: 12px;
`;

export const Accounts = styled.div`
  display: grid;
  gap: 12px;
  max-height: 280px;
  overflow: auto;
`;

export const AccountCard = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  text-align: left;
  border-radius: 14px;
  border: 1px solid ${color.borderLightest};
  background: #ffffff;
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
  ${mixin.clickable}
  &:hover {
    transform: translateY(-1px);
    border-color: ${color.borderInputFocus};
    box-shadow: 0 8px 20px -12px rgba(9, 30, 66, 0.3);
  }
  &:disabled {
    opacity: 0.65;
    cursor: default;
    transform: none;
  }
`;

export const ShowcaseLine = styled.div`
  height: 18px;
  width: ${props => (props.$short ? '58%' : '100%')};
  border-radius: 999px;
  background: ${props =>
    props.$short
      ? 'linear-gradient(90deg, rgba(79, 70, 229, 0.85), rgba(99, 102, 241, 0.35))'
      : 'linear-gradient(90deg, rgba(148, 163, 184, 0.35), rgba(226, 232, 240, 0.85))'};
`;

export const AccountMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

export const AccountText = styled.div`
  min-width: 0;
`;

export const AccountName = styled.div`
  color: ${color.textDark};
  ${font.size(15)}
  ${font.bold}
`;

export const AccountEmail = styled.div`
  margin-top: 2px;
  color: ${color.textLight};
  ${font.size(13)}
`;

export const RolePill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: ${color.backgroundLightPrimary};
  color: ${color.primary};
  white-space: nowrap;
  ${font.size(12)}
  ${font.bold}
`;

export const FieldLabel = styled.label`
  color: ${color.textDark};
  ${font.size(13)}
  ${font.bold}
`;

export const Hint = styled.p`
  color: ${color.textLight};
  ${font.size(12.5)}
  line-height: 1.6;
`;
