#!/usr/bin/env node

// Test script to verify environment variables
console.log('🔍 Verificando configuração do ambiente...\n')

// Check if .env.local exists
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '.env.local')

if (!fs.existsSync(envPath)) {
  console.log('❌ Arquivo .env.local não encontrado!')
  console.log('📝 Crie o arquivo .env.local com as variáveis necessárias')
  console.log('📖 Consulte o arquivo SETUP.md para instruções detalhadas\n')
  process.exit(1)
}

// Load environment variables
require('dotenv').config({ path: envPath })

// Check required variables
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
]

const optionalVars = [
  'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'
]

console.log('📋 Variáveis obrigatórias:')
let allRequired = true

requiredVars.forEach(varName => {
  const value = process.env[varName]
  if (value && value !== 'your_supabase_url_here' && value !== 'your_supabase_anon_key_here') {
    console.log(`✅ ${varName}: Configurada`)
  } else {
    console.log(`❌ ${varName}: Não configurada ou valor padrão`)
    allRequired = false
  }
})

console.log('\n📋 Variáveis opcionais:')
optionalVars.forEach(varName => {
  const value = process.env[varName]
  if (value && value !== 'your_google_maps_api_key_here') {
    console.log(`✅ ${varName}: Configurada`)
  } else {
    console.log(`⚠️  ${varName}: Não configurada (opcional)`)
  }
})

console.log('\n📊 Resumo:')
if (allRequired) {
  console.log('✅ Todas as variáveis obrigatórias estão configuradas!')
  console.log('🚀 O aplicativo deve funcionar corretamente')
} else {
  console.log('❌ Algumas variáveis obrigatórias não estão configuradas')
  console.log('📖 Consulte o arquivo SETUP.md para instruções de configuração')
}

console.log('\n💡 Dica: Reinicie o servidor após configurar as variáveis de ambiente')
console.log('   npm run dev')