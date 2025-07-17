"use client"

import React, { useEffect } from "react"

const Sheet = ({ children, open, onOpenChange }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  return (
    <>
      {React.Children.map(children, (child) => React.cloneElement(child, { open, onOpenChange }))}
      {open && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => onOpenChange(false)} />}
    </>
  )
}

const SheetTrigger = ({ children, asChild, open, onOpenChange }) => {
  if (asChild) {
    return React.cloneElement(children, {
      onClick: () => onOpenChange(true),
    })
  }

  return <button onClick={() => onOpenChange(true)}>{children}</button>
}

const SheetContent = ({ children, side = "right", className = "", open, onOpenChange }) => {
  if (!open) return null

  const sideStyles = {
    right: "right-0 top-0 h-full border-l",
    left: "left-0 top-0 h-full border-r",
    top: "top-0 left-0 w-full border-b",
    bottom: "bottom-0 left-0 w-full border-t",
  }

  const animationStyles = {
    right: open ? "translate-x-0" : "translate-x-full",
    left: open ? "translate-x-0" : "-translate-x-full",
    top: open ? "translate-y-0" : "-translate-y-full",
    bottom: open ? "translate-y-0" : "translate-y-full",
  }

  return (
    <div
      className={`fixed z-50 bg-white shadow-lg transition-transform duration-300 ease-in-out ${sideStyles[side]} ${animationStyles[side]} ${className}`}
    >
      <button
        onClick={() => onOpenChange(false)}
        className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {children}
    </div>
  )
}

export { Sheet, SheetTrigger, SheetContent }
