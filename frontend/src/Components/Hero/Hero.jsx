import React from 'react'
import "./Hero.css"
import hand_icon from "../../assets/hand_icon.png"
import arrow_icon from "../../assets/arrow_icon.png"
import men from "../../assets/img/banner/banner1.jpg"
import men2 from "../../assets/img/banner/banner3.jpg"
import men3 from "../../assets/img/banner/banner5.jpg"
import men4 from "../../assets/img/banner/banner0.webp"

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
const Hero = () => {
  return (
    <div className='hero'>
        
        
        
  {/* <img src={men} alt=""  /> */}
      <div className="w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-lg">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
  
        loop={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img
            src={men}
            alt="Banner 1"
            className="w-full h-[400px] object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={men2}
            alt="Banner 2"
            className="w-full h-[400px] object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={
              men3
            }
            alt="Banner 3"
            className="w-full h-[400px] object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={
              men4
            }
            alt="Banner 3"
            className="w-full h-[400px] object-cover"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  
      
    </div>
  )
}

export default Hero