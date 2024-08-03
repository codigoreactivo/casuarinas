import React from 'react'
import Image from 'next/image'
const MapStyle = () => {
    return (
        <div className=' relative'>
            <div>
                <div>
                    <Image src="/path/to/image.jpg" alt="Image" width={500} height={300} />
                </div>
                <p>Satelital</p>
            </div>
            <div className=' absolute'>
                <div>
                    <div>
                        <Image src="/path/to/image.jpg" alt="Image" width={500} height={300} />
                    </div>
                    <p>Mapa</p>
                </div>
                <div>
                    <div>
                        <Image src="/path/to/image.jpg" alt="Image" width={500} height={300} />
                    </div>
                    <p>Mapa</p>
                </div>
            </div>
        </div>
    )
}

export default MapStyle