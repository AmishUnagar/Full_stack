import React from 'react'
import Hero from '../Components/Hero/Hero'
import Category from '../Components/categories/Category'
import Popular from '../Components/Popular/Popular'
import Offers from '../Components/Offers/Offers'
import NewCollections from "../Components/NewCollections/NewCollections"
import Newsletter from '../Components/NewsLetter/Newsletter'
import Footer from '../Components/Footer/Footer'


const Shop = () => {
  return (
    <div>
      <Hero/>
      <Category/>
      <Popular/>
      <Offers/>
      <Newsletter/>
      <NewCollections/>
      
    </div>
  )
}

export default Shop