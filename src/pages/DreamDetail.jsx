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
} from "../styles/Detail.styles";

function DreamDetail() {
  const navigate = useNavigate();
  const { state: dream } = useLocation();
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [dreamList, setDreamList] = useState([]);

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

    if (!dream?.detail) {
      alert("꿈 이야기가 없습니다.");
      return; // 꿈 이야기 없으면 문구 및 함수 종료
    }

    setLoading(true); // 로딩 중

    setAiResult(""); // 기존 분석글을 공백으로 출력

    try {
      // fetch로 데이터를 전달 즉, request하고, response 대기
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST", // 글 전송
          // 답변 길이 제한
          max_tokens: 500,
          // 창의적인 답변 정도
          temperature: 0.9,
          // 단어 선택 정도
          top_p: 1,
          // 몇가자의 답변을 할지
          n: 1,
          // 새로운 주제를 GPT가 제시할지 말지 주는 점수
          presence_penalty: 0.6,
          // 반복 방지로 동일한 단어가 계속 반복되지 않도록 제어
          frequency_penalty: 0.2,

          // 아래 항목은 어떠한 형태로 내용을 보냈는지
          headers: {
            "Content-Type": "application/json", // JSON 형태
            // 자격증명으로 허가된 키로 요청
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
          // 아래는 실제 보낼 내용
          // JSON.stringify: JSON 글자로 변환
          body: JSON.stringify({
            // ChatGPT 엔진 종류
            // model: "gpt-4o",
            model: "gpt-3.5-turbo",
            // 필요한 프롬프트 전달
            messages: [
              {
                role: "system", // GPT 역할 부여
                content:
                  "당신은 수십 년의 경험을 가진 세계 최고의 심리학 기반의 전문 꿈 해몽가입니다. 사용자가 묘사한 꿈 속 상징들을 심층적으로 분석하고, 그것이 내면의 감정, 욕망, 혹은 무의식의 신호와 어떻게 연결되는지 설명해주세요. 해몽에는 정신분석학, 융 심리학의 관점도 활용해주세요. 항상 풍부하고 구체적인 문장으로 해석하며, 사용자의 삶과 연결되는 실질적인 조언도 함께 제공하세요. 답변은 자연스럽고 따뜻한 한국어로 작성해주세요.",
              },
              {
                role: "user", //사용자 입력내용을 작성
                content: dream.detail,
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
      // 삭제할 꿈의 ID만 넘김
      navigate("/dreamlist", {
        state: { deletedId: dream?.id },
        replace: true,
      });
    }
  };

  return (
    <Container>
      <BackButton to="/dreamlist" />
      <Title title="꿈 상세보기" />
      <Detail.DetailWrap>
        <Detail.DetailTop>
          <Detail.DetailTitleWrap>
            <Detail.DetailTitle>꿈 상세내용</Detail.DetailTitle>
            <Detail.DetailSubTitle>
              지난 꿈을 다시 기억해보세요.
            </Detail.DetailSubTitle>
          </Detail.DetailTitleWrap>
          <Detail.DetailAiAsk onClick={handleAiRequest}>
            AI 해몽 요청하기
          </Detail.DetailAiAsk>
        </Detail.DetailTop>
        <Detail.DetailName
          readOnly
          value={dream?.title || ""}
        ></Detail.DetailName>
        <Detail.DetailText
          readOnly
          value={dream?.detail || ""}
        ></Detail.DetailText>
        <Detail.DetailButtonWrap>
          <Detail.DetailBttuon
            onClick={() =>
              navigate("/dreamedit", {
                state: {
                  id: dream?.id,
                  title: dream?.title,
                  detail: dream?.detail,
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

export default DreamDetail;
