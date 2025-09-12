"use client"
import { SessionProvider } from "next-auth/react"
import React from "react"

// This file provides the Auth context to the application
// It wraps the entire application in the SessionProvider component
// so that the session is available throughout the app
// This is necessary for NextAuth.js to work correctly
// The SessionProvider component is imported from next-auth/react
// and is used to provide the session context to the app
export default function App({
    children
}:{children: React.ReactNode}) {
  return (
    <SessionProvider >
      {children}
    </SessionProvider>
  )
}