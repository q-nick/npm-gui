import React, { HTMLAttributes } from 'react';

export interface Props extends HTMLAttributes<HTMLSpanElement> {
  glyph: string;
}

export function Icon({ className, glyph }:Props):JSX.Element {
  return (
    <span
      className={`oi ${className}`}
      data-glyph={glyph}
    />
  );
}
