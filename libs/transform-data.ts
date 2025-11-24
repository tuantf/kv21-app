// Helper function to extract year from data item
export const extractYear = (item: Record<string, any>): number | null => {
  const yearValue = item['Năm']
  if (yearValue === undefined || yearValue === null) return null
  const year = typeof yearValue === 'string' ? Number(yearValue.trim()) : Number(yearValue)
  return !isNaN(year) ? year : null
}

// Helper function to transform data item (add Total field, remove Năm)
export const transformDataItem = (item: Record<string, any>, fields: string[]) => {
  const { Năm, ...rest } = item
  const total = fields.reduce((sum, field) => sum + Number(item[field] || 0), 0)
  return {
    ...rest,
    Total: total,
  }
}

// Helper function to filter and transform data by year
export const filterAndTransformByYear = (
  data: Record<string, any>[],
  year: number,
  fields: string[],
) => {
  return data
    .filter(item => {
      const itemYear = extractYear(item)
      return itemYear !== null && itemYear === year
    })
    .map(item => transformDataItem(item, fields))
}

// Helper function to calculate total for a specific field
export const calculateTotal = (data: Array<Record<string, any>>, field: string): number => {
  return data.reduce((acc, curr) => acc + Number(curr[field] || 0), 0)
}
