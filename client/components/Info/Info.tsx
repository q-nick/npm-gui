import React , {useEffect, useState} from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import GitHubButton from 'react-github-btn';

const InfoWrapper = styled.div`
  min-height: 45px;
  max-height: 45px;
  background: #3e3f3a;
  padding: 5px 15px;
`;

export function Info(): JSX.Element {
  const [content, setContent] = useState('');

  useEffect(() => {
    Axios
      .get<string>('/api/info')
      .then(({ data }) => {
        // tricky one
        setContent(data);
        setTimeout(() => {
          const script = document.createElement('script');
          script.src = 'https://buttons.github.io/buttons.js';
          document.head.appendChild(script);
        }, 0);
      });
  },[]);

  return (<InfoWrapper>
    <div dangerouslySetInnerHTML={{ __html: content}} />
  </InfoWrapper>)
}
