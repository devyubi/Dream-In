import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import Title from "../components/common/Title";
import { Detail } from "../styles/Detail.styles";
import { useState } from "react";

function EmotionEdit() {
  const location = useLocation();
  const navigate = useNavigate();

  const { id, title, detail } = location.state || {};
  const editEmotion = location.state || {};

  const [editTitle, setEditTitle] = useState(editEmotion.title || "");
  const [editDetail, setEditDetail] = useState(editEmotion.detail || "");

  const handleEditSubmit = () => {
    const confirmEdit = window.confirm("정말 수정하시겠습니까?");
    if (confirmEdit) {
      alert("정상적으로 수정되었습니다.");
      navigate(`/emotiondetail/${id}`, {
        state: {
          ...editEmotion,
          title: editTitle,
          detail: editDetail,
        },
        replace: true,
      });
    }
  };

  return (
    <Container>
      <BackButton to="/emotiondetail" />
      <Title title="감정일기 이야기 수정하기" />
      <Detail.DetailWrap>
        <Detail.DetailTop>
          <Detail.DetailTitleWrap>
            <Detail.DetailTitle>감정일기 수정하기</Detail.DetailTitle>
            <Detail.DetailSubTitle>
              지난 감정을 수정하세요.
            </Detail.DetailSubTitle>
          </Detail.DetailTitleWrap>
        </Detail.DetailTop>
        <Detail.DetailName
          type="text"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
        ></Detail.DetailName>
        <Detail.DetailText
          value={editDetail}
          onChange={e => setEditDetail(e.target.value)}
        ></Detail.DetailText>
        <Detail.DetailButtonWrap>
          <Detail.DetailBttuon onClick={handleEditSubmit}>
            저장하기
          </Detail.DetailBttuon>
        </Detail.DetailButtonWrap>
      </Detail.DetailWrap>
    </Container>
  );
}

export default EmotionEdit;
