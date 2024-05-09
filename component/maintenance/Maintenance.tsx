import React from 'react';
import Image from 'next/image';

function Maintenance() {
    return (
        <div className="">
            <div className="maintenance-content">
                <Image
                    src={require("../../image/download.svg")}
                    alt=""
                    width={600}
                    height={600}
                />
                <p className="maintenance-text my-3 font-bold text-center text-2xl animate-bounce">We are under Maintenance</p>
            </div>
        </div>
    );
}

export default Maintenance;
