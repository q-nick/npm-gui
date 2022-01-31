import type { HTMLAttributes } from 'react';

export interface Props extends HTMLAttributes<HTMLSpanElement> {
  glyph: string;
}

export const Icon: React.FC<Props> = ({ className = '', glyph }) => (
  <span className={`oi ${className}`} data-glyph={glyph} />
);
