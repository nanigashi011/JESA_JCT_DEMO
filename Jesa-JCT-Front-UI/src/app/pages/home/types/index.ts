// Dashboard Types and Interfaces

export interface KPIData {
  id: string
  title: string
  value: string | number
  subtitle?: string
  type: 'progress' | 'cost' | 'date' | 'chart'
  icon?: string
  chartData?: any
  additionalInfo?: {
    label: string
    value: string
  }[]
}

export interface TickerKPI {
  id: string
  label: string
  value: string
  trend: 'up' | 'down' | 'neutral'
  trendValue: string
  icon?: string
}

export interface Alert {
  id: string
  title: string
  type: 'danger' | 'warning' | 'info' | 'success'
  projectName: string
  reportingDate: string
  impactedActivities?: number
  baseline?: string
  forecast?: string
  daysDelay?: number
  hasTeams?: boolean
  wpsImage?: string
}

export interface Action {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  dueDate: string
  status: 'pending' | 'in-progress' | 'completed'
  assignedTo?: string
  category: string
}

export interface SupportRequest {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: string
  from: string
  startDate: string
  endDate: string
  days?: number
  canAssign?: boolean
}

export interface Application {
  id: string
  name: string
  icon: string
  enabled: boolean
}

export interface RealityItem {
  id: string
  title: string
  icon: string
  image: string
}

export interface Program {
  id: string
  name: string
  code: string
  icon?: string
}

export interface DashboardStats {
  kpis: KPIData[]
  ticker: TickerKPI[]
  alerts: Alert[]
  actions: Action[]
}
