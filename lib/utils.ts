import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhone(value: string): string {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '')
  
  // Apply Brazilian phone format: (XX) XXXXX-XXXX
  if (numbers.length <= 2) {
    return `(${numbers}`
  } else if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  } else if (numbers.length <= 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }
}

// Utility function to clear browser storage and force fresh authentication
export function clearBrowserStorage() {
  try {
    // Clear localStorage
    localStorage.clear()
    // Clear sessionStorage
    sessionStorage.clear()
    // Clear cookies (if any)
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    })
  } catch (error) {
    console.warn('Could not clear browser storage:', error)
  }
}

// Utility function to detect browser switching issues
export function detectBrowserIssues(): boolean {
  try {
    // Check if we can access localStorage
    const testKey = '__browser_test__'
    localStorage.setItem(testKey, 'test')
    const result = localStorage.getItem(testKey)
    localStorage.removeItem(testKey)
    
    if (result !== 'test') {
      return true // Browser storage is not working properly
    }
    
    return false
  } catch (error) {
    return true // Browser storage is not accessible
  }
}