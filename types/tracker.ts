export type TrackerType = 'attendance' | 'assignment'

export interface TrackerFormData {
  type: TrackerType
  title: string
  description: string
  course: string
}