import React from 'react'

const Loading = () => {
    return (
        <div className='inline-flex items-center space-x-2'>
            <style jsx>{`
                @keyframes wave {
                    0%, 60%, 100% {
                        transform: translateY(0) scale(1);
                    }
                    30% {
                        transform: translateY(-20px) scale(1.1);
                    }
                }
                
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.7;
                        transform: scale(1.05);
                    }
                }
                
                .animate-wave {
                    animation: wave 1.4s ease-in-out infinite;
                }
                
                .animate-pulse-custom {
                    animation: pulse 2s ease-in-out infinite;
                }
            `}</style>
            
            {/* Red circle */}
            <div className="w-6 h-6 rounded-full animate-wave shadow-lg" 
                 style={{
                     backgroundColor: '#FF3333',
                     animationDelay: '-0.2s'
                 }}>
            </div>
            
            {/* Yellow circle */}
            <div className="w-6 h-6 rounded-full animate-wave shadow-lg" 
                 style={{
                     backgroundColor: '#FFD700',
                     animationDelay: '-0.1s'
                 }}>
            </div>
            
            {/* Teal circle */}
            <div className="w-6 h-6 rounded-full animate-wave shadow-lg" 
                 style={{
                     backgroundColor: '#20B2AA',
                     animationDelay: '0s'
                 }}>
            </div>
        </div>
    )
}

export default Loading