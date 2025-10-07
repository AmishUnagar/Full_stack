import React from 'react'

export function Avatar({ src, alt = '', className = '' }) {
  return (
    <div className={`h-16 w-16 rounded-full overflow-hidden bg-gray-100 ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-gray-400">?
        </div>
      )}
    </div>
  )
}


