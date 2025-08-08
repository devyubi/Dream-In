import styled from "@emotion/styled";

export const DetailWrap = styled.div`
  width: 100%;
  height: auto;
  background: linear-gradient(
    to right,
    rgba(230, 179, 247, 0.3),
    rgba(211, 188, 232, 0.3),
    rgba(194, 193, 238, 0.3)
  );
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  padding-bottom: 30px;
`;
export const DetailTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
`;
export const DetailTitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
export const DetailTitle = styled.h2`
  margin: 0;
  font-size: 20px;
`;
export const DetailSubTitle = styled.p`
  margin: 0;
  font-size: 16px;
`;
export const DetailAiAsk = styled.button`
  padding: 17px 25px;
  max-height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #e2e2e2;
  border-radius: 16px;
  background-color: #fcf3fb;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #fad4e8;
    box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.15);
  }
`;
export const DetailName = styled.input`
  font-family: "tj400";
  font-size: 16px;
  margin: 0 30px 30px 30px;
  border: 1px solid #c8c8c8;
  border-radius: 16px;
  background-color: #fcf3fb;
  padding: 8px 10px;
  background: linear-gradient(
    to right,
    rgba(230, 179, 247, 0.3),
    rgba(211, 188, 232, 0.3),
    rgba(194, 193, 238, 0.3)
  );
  height: 40px;
`;
export const DetailText = styled.textarea`
  font-family: "tj400";
  font-size: 16px;
  margin: 0 30px 30px 30px;
  padding: 15px 10px;
  border: 1px solid #c8c8c8;
  border-radius: 16px;
  background: linear-gradient(
    to right,
    rgba(230, 179, 247, 0.3),
    rgba(211, 188, 232, 0.3),
    rgba(194, 193, 238, 0.3)
  );
  min-height: 200px;
  resize: none;
  /* 스크롤바 */
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #b58edc; /* 스크롤바 색 */
    border-radius: 8px;
    border: 2px solid #f5e6ff; /* 주변 테두리 */
  }

  &::-webkit-scrollbar-track {
    background-color: #f5e6ff; /* 트랙 색상 */
    border-radius: 16px;
  }

  scrollbar-width: thin;
  scrollbar-color: #b58edc #f5e6ff;
`;
export const DetailButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 100px;
  margin-bottom: 30px;
`;
export const DetailBttuon = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  padding: 10px 30px;
  border: 1px solid #e2e2e2;
  border-radius: 16px;
  background-color: #fcf3fb;
  cursor: pointer;
  &:hover {
    background-color: #fad4e8;
    box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.15);
  }
`;
export const DetailAiResultWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: auto;
`;
export const DetailAiResultTitle = styled.h2`
  margin-left: 35px;
`;
export const DetailAiResult = styled.textarea`
  margin: 0 30px 30px 30px;
  font-family: "tj400";
  font-size: 16px;
  height: 300px;
  padding: 15px 10px;
  border: 1px solid #c8c8c8;
  border-radius: 16px;
  background: linear-gradient(
    to right,
    rgba(230, 179, 247, 0.3),
    rgba(211, 188, 232, 0.3),
    rgba(194, 193, 238, 0.3)
  );
  min-height: 350px;
  resize: none;
  /* 스크롤바 */
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #b58edc; /* 스크롤바 색 */
    border-radius: 8px;
    border: 2px solid #f5e6ff; /* 주변 테두리 */
  }

  &::-webkit-scrollbar-track {
    background-color: #f5e6ff; /* 트랙 색상 */
    border-radius: 16px;
  }

  scrollbar-width: thin;
  scrollbar-color: #b58edc #f5e6ff;
`;

export const Detail = {
  DetailWrap,
  DetailTop,
  DetailTitleWrap,
  DetailTitle,
  DetailSubTitle,
  DetailAiAsk,
  DetailName,
  DetailText,
  DetailButtonWrap,
  DetailBttuon,
  DetailAiResult,
};
