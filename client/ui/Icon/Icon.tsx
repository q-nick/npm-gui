import caretRight from 'open-iconic/svg/caret-right.svg';
import check from 'open-iconic/svg/check.svg';
import cloudDownload from 'open-iconic/svg/cloud-download.svg';
import code from 'open-iconic/svg/code.svg';
import dataTransferDownload from 'open-iconic/svg/data-transfer-download.svg';
import folder from 'open-iconic/svg/folder.svg';
import fork from 'open-iconic/svg/fork.svg';
import globe from 'open-iconic/svg/globe.svg';
import home from 'open-iconic/svg/home.svg';
import reload from 'open-iconic/svg/reload.svg';
import trash from 'open-iconic/svg/trash.svg';
import x from 'open-iconic/svg/x.svg';
import type { HTMLAttributes } from 'react';
import styled from 'styled-components';

import type { CSSType } from '../../Styled';

const icons = {
  globe,
  code,
  'caret-right': caretRight,
  x,
  folder,
  check,
  'data-transfer-download': dataTransferDownload,
  'cloud-download': cloudDownload,
  home,
  trash,
  fork,
  reload,
};

export interface Props extends HTMLAttributes<HTMLSpanElement> {
  glyph: keyof typeof icons;
}

export const Icon = styled.i<Props>`
  display: inline-block;
  width: 1em;
  height: 1em;
  background-color: white;
  background: url(${({ glyph }): CSSType => icons[glyph]});
  background-size: contain;
  background-repeat: no-repeat;
  margin-bottom: 2px;
  filter: invert(100%);
`;
