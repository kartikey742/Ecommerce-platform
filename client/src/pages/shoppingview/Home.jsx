import React from 'react'
import  HeroCarousel  from '../../components/shoppingview/HeroCarousel'
import ShopByCategory from './ShopByCategory'
import ShopByBrand from './ShopByBrand'
export const Home = () => {
 

  return (
    <div>
       <HeroCarousel  />
       <ShopByCategory />
       <ShopByBrand />
    </div>
  )
}
