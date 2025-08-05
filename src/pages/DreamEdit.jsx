import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import Title from "../components/common/Title";
import { Detail } from "./Detail.styles";
import { useState } from "react";

function DreamEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  // 혹시 없을 경우 대비
  const { id, title, detail } = location.state || {};

  const editDream = location.state || {};

  // 기본값으로 넘겨받은 값들 설정
  const [editTitle, setEditTitle] = useState(editDream.title || "");
  const [editDetail, setEditDetail] = useState(editDream.detail || "");

  const handleEditSubmit = () => {
    const confirmEdit = window.confirm("정말 수정하시겠습니까?");
    if (confirmEdit) {
      alert("정상적으로 수정되었습니다.");
      navigate("/dreamdetail/${dream.id}", {
        state: {
          ...editDream,
          title: editTitle,
          detail: editDetail,
        },
        replace: true,
      });
    }
  };

  return (
    <Container>
      <BackButton to="/dreamdetail" />
      <Title title="꿈 이야기 수정하기" />
      <Detail.DetailWrap>
        <Detail.DetailTop>
          <Detail.DetailTitleWrap>
            <Detail.DetailTitle>꿈 수정하기</Detail.DetailTitle>
            <Detail.DetailSubTitle>
              지난 꿈을 다시 수정하세요.
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

export default DreamEdit;
