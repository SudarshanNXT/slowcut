import React from 'react'

const Loading = () => {
    return (
        <div className='inline-flex items-center space-x-2'>
            <div className="w-6 h-6 bg-accent rounded-full animate-wave [animation-delay:-0.2s]"></div>
            <div className="w-6 h-6 bg-green-500 rounded-full animate-wave [animation-delay:-0.1s]"></div>
            <div className="w-6 h-6 bg-blue-500 rounded-full animate-wave"></div>
        </div>
    )
}

export default Loading