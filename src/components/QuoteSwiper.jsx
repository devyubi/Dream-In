import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./../css/quoteswiper.css";

const slideData = [
  {
    title: "“Dreams are today's answers to tomorrow's questions.”",
    name: "Edgar Cayce",
    wise: "“꿈은 내일의 질문에 대한 오늘의 해답이다.”",
  },
  {
    title:
      "“A dream you dream alone is only a dream. A dream you dream together is reality.”",
    name: "John Lenno",
    wise: "“혼자 꾸는 꿈은 그저 꿈일 뿐이지만, 함께 꾸는 꿈은 현실이 된다.”",
  },
  {
    title: "“Dreams are the touchstones of our character.”",
    name: "Henry David Thoreau",
    wise: "“꿈은 우리 인격의 기준점이다.”",
  },
  {
    title: "“All that we see or seem is but a dream within a dream.”",
    name: "Edgar Allan Poe",
    wise: "“우리가 보고 느끼는 모든 것은 꿈 속의 또 다른 꿈일 뿐이다.”",
  },
  {
    title:
      "“The future belongs to those who believe in the beauty of their dreams.”",
    name: "Eleanor Roosevelt",
    wise: "“미래는 자신의 꿈의 아름다움을 믿는 사람들의 것이다.”",
  },
];

function QuoteSwiper() {
  return (
    <div>
      <div className="visual-slide">
        <Swiper
          loop={true}
          modules={[Autoplay, Pagination]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          className="sw-visual"
        >
          {slideData.map((item, index) => {
            return (
              <SwiperSlide key={index}>
                <div className="slide-content">
                  <p>{item.title}</p>
                  <p>- {item.name}</p>
                  <p>{item.wise}</p>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

export default QuoteSwiper;
