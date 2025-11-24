/**
 * Get color based on progress value ranges
 * @param value - Progress value (0-100)
 * @param type - 'forward' for increasing urgency (blue -> yellow -> orange -> red)
 *               'backward' for decreasing urgency (red -> orange -> yellow -> blue)
 * @returns Hex color string
 */
export const getProgressColor = (value: number, type: 'forward' | 'backward'): string => {
  if (type === 'forward') {
    if (value < 25) {
      return '#1e88e5'
    } else if (value < 50) {
      return '#ffb600'
    } else if (value < 75) {
      return '#ff6800'
    } else {
      return '#ff4000'
    }
  } else {
    if (value < 25) {
      return '#ff4000'
    } else if (value < 50) {
      return '#ff6800'
    } else if (value < 75) {
      return '#ffb600'
    } else {
      return '#1e88e5'
    }
  }
}

/**
 * Get Tailwind CSS class name based on progress value ranges
 * @param value - Progress value (0-100)
 * @param type - 'forward' for increasing urgency (blue -> yellow -> orange -> red)
 *               'backward' for decreasing urgency (red -> orange -> yellow -> blue)
 * @returns Tailwind CSS class name (e.g., 'text-blue-600')
 */
export const getProgressColorClass = (value: number, type: 'forward' | 'backward'): string => {
  if (type === 'forward') {
    if (value < 25) {
      return 'text-[#1e88e5]'
    } else if (value < 50) {
      return 'text-[#ffb600]'
    } else if (value < 75) {
      return 'text-[#ff6800]'
    } else {
      return 'text-[#ff4000]'
    }
  } else {
    if (value < 25) {
      return 'text-[#ff4000]'
    } else if (value < 50) {
      return 'text-[#ff6800]'
    } else if (value < 75) {
      return 'text-[#ffb600]'
    } else {
      return 'text-[#1e88e5]'
    }
  }
}
