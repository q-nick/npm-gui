import { useEffect, useState } from 'react';
import styled from 'styled-components';

const InfoWrapper = styled.div`
  min-height: 45px;
  max-height: 45px;
  background: #3e3f3a;
  padding: 5px 15px;
`;

export function Info(): JSX.Element {
  const [content, setContent] = useState('');

  async function load(): Promise<void> {
    const response = await fetch('/api/info');
    const data = await response.text();
    // tricky one
    setContent(data);
    setTimeout(() => {
      const script = document.createElement('script');
      script.src = 'https://buttons.github.io/buttons.js';
      document.head.appendChild(script);
    });
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <InfoWrapper>
      <div
        dangerouslySetInnerHTML={{ // eslint-disable-line
          __html: content,
        }}
      />
    </InfoWrapper>
  );
}
