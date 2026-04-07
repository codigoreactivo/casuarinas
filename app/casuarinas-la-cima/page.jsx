import React from 'react'
import MapBoxCima from '../components/MapBoxCima'

const LaCima = () => {
    return (
        <div className=' h-full ' style={{ maxHeight: "calc(100vh - 60px)" }}>
            <MapBoxCima></MapBoxCima>
        </div>
    )
}

export default LaCima