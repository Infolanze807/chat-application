import React from 'react'

const Button = ({label="Button", type="button", className="", disabled= false}) => {
  return (
    <div>
        <button type={type} className={`text-white bg-primary hover:bg-primary font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center ${className}`} disabled={disabled}>{label}</button>
    </div>
  )
}

export default Button
