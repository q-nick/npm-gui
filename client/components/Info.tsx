import type { FC } from 'react';
import { useEffect } from 'react';

import { trpc } from '../trpc';
// import styled from 'styled-components';

// const InfoWrapper = styled.div`
//   min-height: 45px;
//   max-height: 45px;
//   background: #3e3f3a;
//   padding: 5px 15px;
// `;

export const Info: FC = () => {
  const { data: content } = trpc.info.useQuery(
    window.localStorage.getItem('npm-gui-id') || 'unknown',
    {
      enabled: window.localStorage.getItem('npm-gui-id') !== 'developer',
    },
  );

  useEffect(() => {
    if (content) {
      const script = document.createElement('script');
      script.src = 'https://buttons.github.io/buttons.js';
      document.head.append(script);
    }
  }, [content]);

  if (!content) {
    return null;
  }

  return (
    <div
      className="min-h-[45px] max-h-[45px] bg-neutral-700"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        // eslint-disable-next-line @typescript-eslint/naming-convention
        __html: content,
      }}
    />
  );
};
