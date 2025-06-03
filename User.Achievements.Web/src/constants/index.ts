// Define colors for achievement levels
export const LEVEL_COLOURS: Record<string, string> = {
    bronze: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700',
    platinum: '#0070FF',
}

// Helper function to determine the color based on achievement level
export const getLevelColour = (level: string): string => {
    const lowerLevel = level.toLowerCase()
    return LEVEL_COLOURS[lowerLevel] || '#757575' // Default gray if level not found
}

// Helper function to determine text color based on level
export const getLevelTextColour = (level: string): string => {
    return ['gold', 'platinum'].includes(level.toLowerCase())
        ? 'black'
        : 'white'
}
