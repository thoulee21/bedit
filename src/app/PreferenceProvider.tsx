import { createContext, useContext } from "react"

export interface PreferencesType {
    prefersDarkMode: boolean, setPrefersDarkMode: (prefersDarkMode: boolean) => void
}

export const Preferences = createContext<PreferencesType>({} as PreferencesType)
export const usePreferences = () => useContext(Preferences)