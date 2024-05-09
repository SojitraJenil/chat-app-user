import React from 'react';
import Image from 'next/image';

function Maintenance() {
    return (
        <div className="maintenance-container">
            <div className="maintenance-content">
                <p className="maintenance-text my-3">We are under Maintenance</p>
                <Image
                    src={require("../../image/download.svg")}
                    alt=""
                    width={600}
                    height={600}
                    style={{ animation: 'pulse 2s infinite alternate' }}
                />
            </div>
        </div>
    );
}

export default Maintenance;
