/* eslint-disable @typescript-eslint/naming-convention */
import caretBottom from 'open-iconic/svg/caret-bottom.svg';
import caretRight from 'open-iconic/svg/caret-right.svg';
import caretTop from 'open-iconic/svg/caret-top.svg';
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
import type { FC, HTMLAttributes } from 'react';

const icons = {
  globe,
  code,
  'caret-right': caretRight,
  'caret-bottom': caretBottom,
  'caret-top': caretTop,
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
  readonly glyph: keyof typeof icons;
}

export const Icon: FC<Props> = ({ glyph, className, style }) => {
  return (
    <i
      className={`w-4 h-4 inline-block bg-no-repeat bg-center bg-contain ${className}`}
      style={{ backgroundImage: `url(${icons[glyph]})`, ...style }}
    />
  );
};
