import styled from 'styled-components';

import type { CSSType } from '../../Styled';

export const ScoreBadge = styled.a<{ score?: number }>`
  color: white;
  text-decoration: none;
  font-weight: 100;
  padding: 3px 5px;
  border-radius: 2px;

  ${({ score }): CSSType => score && score >= 85 && 'color: #4c1;'}
  ${({ score }): CSSType => score && score < 85 && 'background: #dbab09;'}
  ${({ score }): CSSType => score && score < 70 && 'background: #e05d44;'}
`;
