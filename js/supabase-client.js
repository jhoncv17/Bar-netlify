import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://0ec90b57d6e95fcbda19832f.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const IGV_RATE = 0.18

export function calculateTax(subtotal) {
  return subtotal * IGV_RATE
}

export function formatCurrency(amount) {
  return `S/ ${amount.toFixed(2)}`
}

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name')

  if (error) throw error
  return data
}

export async function updateProductStock(productId, newStock) {
  const { data, error } = await supabase
    .from('products')
    .update({ stock: newStock })
    .eq('id', productId)
    .select()

  if (error) throw error
  return data
}

export async function createTransaction(transactionData) {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transactionData)
    .select()

  if (error) throw error
  return data[0]
}

export async function createTransactionItems(items) {
  const { data, error } = await supabase
    .from('transaction_items')
    .insert(items)
    .select()

  if (error) throw error
  return data
}

export async function getTransactions(filters = {}) {
  let query = supabase
    .from('transactions')
    .select(`
      *,
      transaction_items(*)
    `)
    .order('created_at', { ascending: false })

  if (filters.dateFrom) {
    query = query.gte('created_at', filters.dateFrom)
  }

  if (filters.dateTo) {
    query = query.lte('created_at', filters.dateTo)
  }

  if (filters.customer) {
    query = query.ilike('customer_name', `%${filters.customer}%`)
  }

  if (filters.paymentMethod && filters.paymentMethod !== 'all') {
    query = query.eq('payment_method', filters.paymentMethod)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export function generateTransactionNumber() {
  const now = new Date()
  const year = now.getFullYear()
  const timestamp = now.getTime()
  return `TXN-${year}-${timestamp.toString().slice(-6)}`
}
