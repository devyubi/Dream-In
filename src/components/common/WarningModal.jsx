/* eslint-disable react/prop-types */
import styled from "@emotion/styled";

const ModalBackGround = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
`;
const ModalContainer = styled.div`
  background: white;
  padding: 20px 30px;
  border-radius: 16px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

function WarningModal({ onClick, onConfirm, onClose, dreamTitle }) {
  return (
    <ModalBackGround onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <p>정말 {dreamTitle} 꿈을 삭제하시겠습니까?</p>
        <button onClick={onConfirm} style={{ marginRight: 10 }}>
          삭제
        </button>
        <button onClick={onClose}>취소</button>
      </ModalContainer>
    </ModalBackGround>
  );
}

export default WarningModal;
