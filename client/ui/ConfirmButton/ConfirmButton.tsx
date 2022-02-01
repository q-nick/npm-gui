import { useCallback } from 'react';
import styled from 'styled-components';

import { useCountdown } from '../../hooks/use-count-down';
import type { Props } from '../Button/Button';
import { Button } from '../Button/Button';

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
`;

const StartButtonThe = styled(Button)`
  margin-right: 0;
`;

const ConfirmButtonThe = styled(Button)`
  position: absolute;
  right: 0;
  top: 0;
`;

export const ConfirmButton: React.FC<Props> = ({ onClick, ...props }) => {
  const { countLeft, onStartCountdown, onStopCountdown } = useCountdown();

  const handleConfirmButtonClick = useCallback((e) => {
    if (onClick) {
      onClick(e);
    }
    onStopCountdown();
  }, []);

  return (
    <Wrapper>
      <StartButtonThe {...props} onClick={onStartCountdown} />

      {countLeft !== undefined && countLeft > 0 && (
        <ConfirmButtonThe {...props} onClick={handleConfirmButtonClick}>
          {`confirm (${countLeft})`}
        </ConfirmButtonThe>
      )}
    </Wrapper>
  );
};
