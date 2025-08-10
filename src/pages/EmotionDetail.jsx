import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import QuantumSpinner from "../components/common/QuantumSpinner";
import Title from "../components/common/Title";
import {
  Detail,
  DetailAiResultTitle,
  DetailAiResultWrap,
} from "./Detail.styles";

function EmotionDetail() {
  const navigate = useNavigate();
  const { state: emotion } = useLocation();
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);

  // 해몽 버튼 클릭 시 포커스 해몽 결과로
  const resultAi = useRef(null);

  useEffect(() => {
    if ((aiResult || loading) && resultAi.current) {
      const element = resultAi.current;
      const elementTop = element.getBoundingClientRect().top;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const offset =
        elementTop +
        scrollTop -
        window.innerHeight / 2 +
        element.offsetHeight / 2;

      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  }, [aiResult, loading]);

  const handleAiRequest = async e => {
    e.preventDefault(); // 새로고침 방지

    if (!emotion?.detail) {
      alert("감정일기가 없습니다.");
      return;
    }

    setLoading(true);

    setAiResult("");

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          max_tokens: 500,
          temperature: 0.9,
          top_p: 1,
          n: 1,
          presence_penalty: 0.6,
          frequency_penalty: 0.2,

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "당신은 수십 년의 경험을 가진 심리학 기반의 전문 상담사 입니다. 사용자가 작성한 감정일기 내용을 심층적으로 분석하고, 내면의 감정을 어떻게 받아들이고 대처해야는지 설명해주세요. 또 따뜻한 공감과 위로, 강열한 응원을 해주세요. 감정 분석에는 정신분석학, 융 심리학 등 여러 분야의 관점도 활용해주세요. 항상 풍부하고 구체적인 문장으로 해석하며, 사용자의 삶과 연결되는 실질적인 조언도 함께 제공하세요. 답변은 자연스럽고 따뜻한 한국어로 작성해주세요.",
              },
              {
                role: "user",
                content: emotion.detail,
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        throw new Error("API 요청 실패");
      }

      const data = await response.json();
      setAiResult(data.choices[0].message.content);
    } catch (error) {
      console.error("error:", error);
      setAiResult(
        "죄송합니다. 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    const confirmResult = window.confirm("이 꿈을 정말 삭제하시겠습니까?");
    if (confirmResult) {
      alert("꿈이 삭제되었습니다.");
      // 삭제한 꿈의 ID 넘김
      navigate("/emotionlist", {
        state: { deleteId: emotion?.id },
        replace: true,
      });
    }
  };

  return (
    <Container>
      <BackButton to="/emotionlist" />
      <Title title="감정일기 상세보기" />
      <Detail.DetailWrap>
        <Detail.DetailTop>
          <Detail.DetailTitleWrap>
            <Detail.DetailTitle>감정일기 상세내용</Detail.DetailTitle>
            <Detail.DetailSubTitle>
              지난 감정을 다시 기억해보세요.
            </Detail.DetailSubTitle>
          </Detail.DetailTitleWrap>
          <Detail.DetailAiAsk onClick={handleAiRequest} disabled={loading}>
            AI 해몽 요청하기
          </Detail.DetailAiAsk>
        </Detail.DetailTop>
        <Detail.DetailName
          readOnly
          value={emotion?.title || ""}
        ></Detail.DetailName>
        <Detail.DetailText
          readOnly
          value={emotion?.detail || ""}
        ></Detail.DetailText>
        <Detail.DetailButtonWrap>
          <Detail.DetailBttuon
            onClick={() =>
              navigate("/emotionedit", {
                state: {
                  id: emotion?.id,
                  title: emotion?.title,
                  detail: emotion?.detail,
                },
              })
            }
            disabled={loading}
          >
            수정하기
          </Detail.DetailBttuon>
          <Detail.DetailBttuon onClick={handleDelete} disabled={loading}>
            삭제하기
          </Detail.DetailBttuon>
        </Detail.DetailButtonWrap>

        <div ref={resultAi}>
          {loading && (
            <div>
              <QuantumSpinner></QuantumSpinner>
            </div>
          )}
          {!loading && aiResult && (
            <DetailAiResultWrap>
              <DetailAiResultTitle>꿈 해몽 결과</DetailAiResultTitle>
              <Detail.DetailAiResult readonly value={aiResult} />
            </DetailAiResultWrap>
          )}
        </div>
      </Detail.DetailWrap>
    </Container>
  );
}

export default EmotionDetail;
