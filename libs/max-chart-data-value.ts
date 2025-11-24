type Record = {
  [key: string]: string | number
}

const maxChartDataValue = (data: Record[]): number => {
  if (!data || data.length === 0) return 0

  const allNumbers = data.flatMap(record =>
    Object.values(record)
      .map(value => {
        if (typeof value === 'number') return value
        if (typeof value === 'string') {
          const parsed = parseFloat(value)
          return isNaN(parsed) ? null : parsed
        }
        return null
      })
      .filter((num): num is number => num !== null),
  )

  const maxValue = allNumbers.length > 0 ? Math.max(...allNumbers) : 0

  return maxValue + 1
}

export { maxChartDataValue }
