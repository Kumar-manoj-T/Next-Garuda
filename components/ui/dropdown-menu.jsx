"use client"

import React, { useState, useRef, useEffect } from "react"

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      {React.Children.map(children, (child) => React.cloneElement(child, { isOpen, setIsOpen }))}
    </div>
  )
}

const DropdownMenuTrigger = ({ children, className = "", isOpen, setIsOpen, asChild = false, ...props }) => {
  const triggerContent = (
    <>
      {children}
      <svg
        className={`ml-1 h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </>
  )

  if (asChild) {
    return React.cloneElement(children, {
      onClick: () => setIsOpen(!isOpen),
      children: triggerContent, // Pass the children and arrow to the cloned element
      ...props,
    })
  }

  return (
    <button className={`flex items-center ${className}`} onClick={() => setIsOpen(!isOpen)} {...props}>
      {triggerContent}
    </button>
  )
}

const DropdownMenuContent = ({ children, isOpen }) => {
  if (!isOpen) return null

  return (
    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
      {children}
    </div>
  )
}

const DropdownMenuItem = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }
