import React from 'react';
import './button.css'
export const Button = ({children, type, onClick, isActive, visible}) => {
    const buttonClasses = ['Button']
    
    type !== null ? buttonClasses.push(`Button--is-${type}`) : buttonClasses.push('Button--is-default')
    isActive ? buttonClasses.push('Button--is-active') : buttonClasses.push('Button--is-inactive')
    
    return (
        <button onClick={onClick} className={buttonClasses.join(' ')} style={visible?null:{display:'none'}}>
            {children}
        </button>
    );
} 