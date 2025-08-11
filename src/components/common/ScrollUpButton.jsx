import styled from "@emotion/styled";

const ScrollUpBtn = styled.button`
  position: fixed;
  bottom: 130px;
  right: 230px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.3);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  width: 40px;
  height: 40px;

  img {
    object-fit: contain;
    width: 70%;
    height: 70%;
  }
  &:hover {
    background-color: #e57cff4c;
  }
`;

function ScrollUpButton() {
  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ScrollUpBtn onClick={scrollUp} aria-label="맨위로 스크롤">
      <img src="/images/up_arrow.png" alt="위로가기" />
    </ScrollUpBtn>
  );
}

export default ScrollUpButton;
