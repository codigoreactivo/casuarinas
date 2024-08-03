import React from 'react'
import MapBoxComponent from '../components/MapBoxComponent'

const LaCima = () => {
    return (
        <div className=' h-full ' style={{ maxHeight: "calc(100vh - 60px)" }}>
            <MapBoxComponent></MapBoxComponent>
        </div>
    )
}

export default LaCima