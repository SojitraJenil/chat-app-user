import React from 'react'
import { CiMenuKebab } from 'react-icons/ci'
import { FaCamera } from 'react-icons/fa'
import { IoSearchSharp } from 'react-icons/io5'

function TopBar() {
    return (

        <div className="aside-header sticky top-0 right-0 left-0 z-40 text-gray-400 bg-[#035F52]">
            <div className="flex items-center px-4 py-3 border-b-2 border">
                <div className="flex-1 text-green-100">
                    <p className='text-2xl font-sans font-semibold'>ChatAPP</p>
                </div>
                <div className="text-white flex gap-4 py-2 pe-3 rounded-r-full text-2xl">
                    <FaCamera />
                    <CiMenuKebab />
                </div>
            </div>
        </div>
    )
}
export default TopBar
