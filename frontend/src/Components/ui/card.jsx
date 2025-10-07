import React from 'react'

export function Card({ className = '', children, ...props }) {
  return (
    <div className={`bg-white rounded-xl shadow-soft border border-gray-100 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ className = '', children, ...props }) {
  return (
    <div className={`p-4 sm:p-6 border-b border-gray-100 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className = '', children, ...props }) {
  return (
    <h3 className={`text-lg font-semibold ${className}`} {...props}>{children}</h3>
  )
}

export function CardContent({ className = '', children, ...props }) {
  return (
    <div className={`p-4 sm:p-6 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className = '', children, ...props }) {
  return (
    <div className={`p-4 sm:p-6 border-t border-gray-100 ${className}`} {...props}>
      {children}
    </div>
  )
}


