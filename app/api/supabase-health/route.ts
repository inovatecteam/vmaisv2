import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const startTime = Date.now()
    
    // Test basic Supabase connection with a simple query
    const { data, error } = await supabase
      .from('ongs')
      .select('count')
      .limit(1)
    
    const responseTime = Date.now() - startTime
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        responseTime
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Conexão com Supabase funcionando',
      responseTime,
      data: data ? 'OK' : 'No data'
    })
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      details: error.message,
      responseTime: 0
    }, { status: 500 })
  }
}
