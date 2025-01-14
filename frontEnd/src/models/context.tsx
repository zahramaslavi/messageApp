import { ReactNode } from "react"

export interface ActionI {
  type: String,
  payload?: any
}

export interface ProviderProps {
  children: ReactNode
}