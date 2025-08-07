/** @jsxImportSource @emotion/react */
import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

// 도트 개수 설정
const NUM_DOTS = 15;

// 애니메이션 생성기: 길고 활발하게, 사라졌다 나타나게
const generateMoveFadeKeyframes = (x, y) => keyframes`
  0% {
    transform: translate(0, 0);
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  50% {
    transform: translate(${x}px, ${y}px);
    opacity: 0.7;
  }
  75% {
    opacity: 1;
  }
  100% {
    transform: translate(0, 0);
    opacity: 0;
  }
`;

const colors = [
  "#FF6B6B",
  "#FEC260",
  "#1DD1A1",
  "#54A0FF",
  "#A29BFE",
  "#FF9FF3",
  "#FF8C94",
  "#00CED1",
  "#F5A623",
  "#8E44AD",
  "#E67E22",
  "#2ECC71",
  "#F368E0",
  "#576574",
  "#10AC84",
];

const Dot = styled.div`
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: ${props => props.color};
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  animation: ${props => props.animation} ${props => props.duration}s ease-in-out
    infinite;
`;

const SpinnerContainer = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto;
`;

function FreeFloatingSpinner() {
  const dots = Array.from({ length: NUM_DOTS }).map((_, index) => {
    const top = Math.random() * 120 + 10; // 10 ~ 130
    const left = Math.random() * 120 + 10;
    const moveX = Math.random() * 160 - 80; // -80 ~ +80
    const moveY = Math.random() * 160 - 80;
    const duration = Math.random() * 2.5 + 2.5; // 2.5 ~ 5초

    return {
      key: index,
      color: colors[index % colors.length],
      top,
      left,
      animation: generateMoveFadeKeyframes(moveX, moveY),
      duration,
    };
  });

  return (
    <SpinnerContainer>
      {dots.map(dot => (
        <Dot
          key={dot.key}
          color={dot.color}
          top={dot.top}
          left={dot.left}
          animation={dot.animation}
          duration={dot.duration}
        />
      ))}
    </SpinnerContainer>
  );
}

export default FreeFloatingSpinner;
