// src/components/common/HeroCarousel.jsx

import React, { useState, useEffect, useCallback } from 'react';
import '../../css/home.css'; // We will create this CSS file next
import banner1 from '../../assets/banner-1.webp';
import banner2 from '../../assets/banner-2.webp';
import banner3 from '../../assets/banner-3.webp';

// Step 2: Use the imported images in your array
const images = [banner1, banner2, banner3];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Content for each slide (customize this for your banners)
  const slideContent = [
    {
      headline: 'Discover the Fall Collection',
      subtext: 'Crafted for the modern spirit.',
      cta: 'Shop Now',
    },
    {
      headline: 'Unmatched Quality & Style',
      subtext: 'Experience the difference in every detail.',
      cta: 'Explore Designs',
    },
    {
      headline: 'Limited Edition Release',
      subtext: 'Don’t miss out on exclusive items.',
      cta: 'View Collection',
    },
  ];

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, images]);

  useEffect(() => {
    // Auto-play the carousel every 5 seconds
    const sliderInterval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(sliderInterval);
  }, [goToNext]);


  return (
    <div className='hero-carousel'>
      <div className='slider-container'>
        {images.map((image, index) => (
          <div
            key={index}
            className={`slide ${index === currentIndex ? 'active' : ''}`}
          >
            <div
              className='slide-background'
              style={{ backgroundImage: `url(${image})` }}
            ></div>
            <div className='slide-content'>
              <h1 className='slide-headline'>{slideContent[index]?.headline}</h1>
              <p className='slide-subtext'>{slideContent[index]?.subtext}</p>
              <button className='slide-cta'>{slideContent[index]?.cta}</button>
            </div>
          </div>
        ))}
      </div>
      
      <div className='carousel-dots'>
        {images.map((_, index) => (
            <div 
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
            ></div>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;