import Image from 'next/image'
import React from 'react'

function Maintenance() {
    return (
        <div>
            <center>
                <Image height={800} width={800} src={require("../../image/download.svg")} alt="" />
                <p className='text-3xl font-bold'>We are under Maintenance</p>
            </center>
        </div>
    )
}
export default Maintenance
