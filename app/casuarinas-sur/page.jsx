import React from 'react'
import Head from 'next/head'
import MapBoxSur from '../components/MapBoxSur'

const CasuarinasSur = () => {
    return (
        <div className=' h-full ' style={{ maxHeight: "calc(100vh - 60px)" }}>
            <Head>
                <title>My page title</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <MapBoxSur></MapBoxSur>
        </div>
    )
}

export default CasuarinasSur