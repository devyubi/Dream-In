import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const twinkle = keyframes`
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
`;

const Star = styled.span`
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: ${twinkle} infinite ease-in-out;
`;

const StarWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none; /* 클릭 방해 방지 */
`;

const generateStars = (count = 20) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const size = Math.random() * 2 + 1;
    const duration = Math.random() * 4 + 2;
    const delay = Math.random() * 3;
    stars.push(
      <Star
        key={i}
        style={{
          top: `${top}%`,
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          opacity: Math.random() * 0.5 + 0.2,
        }}
      />,
    );
  }
  return stars;
};

export default function TwinkleStars({ count = 20 }) {
  return <StarWrapper>{generateStars(count)}</StarWrapper>;
}
