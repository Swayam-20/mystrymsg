import * as React from "react"

export type ToastActionElement = React.ReactElement<{
  altText?: string
}>

export interface ToastProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  variant?: "default" | "destructive"
}

