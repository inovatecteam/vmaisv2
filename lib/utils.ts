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

// Get browser information for debugging
export function getBrowserInfo(): {
  userAgent: string
  browser: string
  version: string
  platform: string
  cookiesEnabled: boolean
  localStorageEnabled: boolean
  sessionStorageEnabled: boolean
} {
  const userAgent = navigator.userAgent
  let browser = 'Unknown'
  let version = 'Unknown'
  
  // Detect browser
  if (userAgent.includes('Chrome')) {
    browser = 'Chrome'
    version = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown'
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox'
    version = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown'
  } else if (userAgent.includes('Safari')) {
    browser = 'Safari'
    version = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown'
  } else if (userAgent.includes('Edge')) {
    browser = 'Edge'
    version = userAgent.match(/Edge\/(\d+)/)?.[1] || 'Unknown'
  }
  
  // Test storage capabilities
  let localStorageEnabled = false
  let sessionStorageEnabled = false
  
  try {
    localStorage.setItem('test', 'test')
    localStorage.removeItem('test')
    localStorageEnabled = true
  } catch (e) {
    localStorageEnabled = false
  }
  
  try {
    sessionStorage.setItem('test', 'test')
    sessionStorage.removeItem('test')
    sessionStorageEnabled = true
  } catch (e) {
    sessionStorageEnabled = false
  }
  
  return {
    userAgent,
    browser,
    version,
    platform: navigator.platform,
    cookiesEnabled: navigator.cookieEnabled,
    localStorageEnabled,
    sessionStorageEnabled
  }
}

// Retry function with exponential backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (attempt === maxRetries) {
        throw error
      }
      
      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt)
      console.log(`🔄 Tentativa ${attempt + 1} falhou, tentando novamente em ${delay}ms...`)
      
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError
}

// Check if error is retryable
export function isRetryableError(error: any): boolean {
  if (!error) return false
  
  const message = error.message || ''
  const code = error.code || ''
  
  // Network errors are usually retryable
  if (message.includes('fetch') || message.includes('network') || message.includes('timeout')) {
    return true
  }
  
  // Supabase specific retryable errors
  if (code === 'PGRST301' || code === 'PGRST302' || code === 'PGRST303') {
    return true // Rate limiting, temporary errors
  }
  
  // JWT errors might be retryable if they're temporary
  if (message.includes('JWT') && !message.includes('expired')) {
    return true
  }
  
  return false
}

// Test Supabase connection to diagnose issues
export async function testSupabaseConnection(): Promise<{
  success: boolean
  error?: string
  details?: any
}> {
  try {
    const startTime = Date.now()
    
    // For static export, we can't use API routes, so we'll test directly with Supabase
    // This function will only work in client-side code
    if (typeof window === 'undefined') {
      return {
        success: false,
        error: 'Esta função não está disponível durante o build estático',
        details: { note: 'Use apenas no lado do cliente' }
      }
    }
    
    // Import Supabase dynamically to avoid build issues
    const { supabase } = await import('./supabase')
    
    // Test basic connection with a simple query
    const { data, error } = await supabase
      .from('ongs')
      .select('count')
      .limit(1)
    
    const responseTime = Date.now() - startTime
    
    if (error) {
      return {
        success: false,
        error: 'Falha na conexão com o banco de dados',
        details: { error, responseTime }
      }
    }
    
    return {
      success: true,
      details: { responseTime, data: data ? 'OK' : 'No data' }
    }
  } catch (error: any) {
    return {
      success: false,
      error: 'Erro de conexão com o banco de dados',
      details: { error: error.message }
    }
  }
}