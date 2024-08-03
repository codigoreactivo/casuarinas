import React from 'react'
import MapBoxComponent from './components/MapBoxComponent'
const Home = () => {
  return (
    <div className=' ' style={{ maxHeight: "calc(100vh - 60px)" }}>
      <MapBoxComponent></MapBoxComponent>
    </div>
  )
}

export default Home