'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react'
import { clearBrowserStorage, detectBrowserIssues } from '@/lib/utils'

interface BrowserRecoveryProps {
  onRecoveryComplete?: () => void
}

export function BrowserRecovery({ onRecoveryComplete }: BrowserRecoveryProps) {
  const [isRecovering, setIsRecovering] = useState(false)
  const [hasIssues, setHasIssues] = useState(false)
  const [recoveryComplete, setRecoveryComplete] = useState(false)

  const checkForIssues = () => {
    const issues = detectBrowserIssues()
    setHasIssues(issues)
    return issues
  }

  const handleRecovery = async () => {
    setIsRecovering(true)
    
    try {
      // Clear browser storage
      clearBrowserStorage()
      
      // Force page reload to clear any cached state
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      
      setRecoveryComplete(true)
      onRecoveryComplete?.()
    } catch (error) {
      console.error('Recovery failed:', error)
    } finally {
      setIsRecovering(false)
    }
  }

  const handleCheck = () => {
    checkForIssues()
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Recuperação do Navegador
        </CardTitle>
        <CardDescription>
          Se você está enfrentando problemas ao trocar de navegador, esta ferramenta pode ajudar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button 
            onClick={handleCheck} 
            variant="outline" 
            className="w-full"
            disabled={isRecovering}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Verificar Problemas
          </Button>
          
          {hasIssues && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Problemas detectados no armazenamento do navegador.
              </p>
            </div>
          )}
          
          {hasIssues && !recoveryComplete && (
            <Button 
              onClick={handleRecovery} 
              className="w-full bg-yellow-600 hover:bg-yellow-700"
              disabled={isRecovering}
            >
              {isRecovering ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Recuperando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Iniciar Recuperação
                </>
              )}
            </Button>
          )}
          
          {recoveryComplete && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Recuperação concluída! A página será recarregada.</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Problemas comuns:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Páginas não carregam ao trocar de navegador</li>
            <li>Erros de autenticação</li>
            <li>Dados não persistem entre sessões</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
