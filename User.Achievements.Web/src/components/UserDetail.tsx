import { useParams, Link } from 'react-router-dom'
import { useUserDetail } from '../hooks/useUserDetail'
import {
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress,
    Button,
    Chip,
    Grid,
    Avatar,
    LinearProgress,
} from '@mui/material'
import { useEffect } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

// Achievement level progression
const LEVELS = ['bronze', 'silver', 'gold', 'platinum']

// Define colors for achievement levels
const LEVEL_COLORS: Record<string, string> = {
    bronze: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700',
    platinum: '#0070FF', // Brighter, more vibrant blue
}

// Progress thresholds for demo purposes
const PROGRESS_MAP: Record<string, number> = {
    bronze: 65,
    silver: 42,
    gold: 78,
    platinum: 100,
}

const UserDetail = () => {
    const { id } = useParams<{ id: string }>()
    const { user, loading, error, fetchUser } = useUserDetail()

    fetchUser(id)

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="200px">
                <CircularProgress />
            </Box>
        )
    }

    if (error) {
        return (
            <Box textAlign="center" p={3}>
                <Typography color="error">{error}</Typography>
                <Button
                    component={Link}
                    to="/"
                    variant="contained"
                    sx={{ mt: 2 }}
                    startIcon={<ArrowBackIcon />}>
                    Back to Users
                </Button>
            </Box>
        )
    }

    if (!user) {
        return (
            <Box textAlign="center" p={3}>
                <Typography>User not found.</Typography>
                <Button
                    component={Link}
                    to="/"
                    variant="contained"
                    sx={{ mt: 2 }}
                    startIcon={<ArrowBackIcon />}>
                    Back to Users
                </Button>
            </Box>
        )
    }

    // Function to determine the color based on achievement level
    const getLevelColor = (level: string): string => {
        const lowerLevel = level.toLowerCase()
        return LEVEL_COLORS[lowerLevel] || '#757575' // Default gray if level not found
    }

    // Get the next level
    const getNextLevel = (currentLevel: string): string => {
        const currentIndex = LEVELS.findIndex(
            (level) => level.toLowerCase() === currentLevel.toLowerCase()
        )

        if (currentIndex === -1 || currentIndex === LEVELS.length - 1) {
            return 'Max Level'
        }

        return (
            LEVELS[currentIndex + 1].charAt(0).toUpperCase() +
            LEVELS[currentIndex + 1].slice(1)
        )
    }

    // Calculate progress to next level (for demo purposes)
    const calculateProgress = (currentLevel: string): number => {
        const lowerLevel = currentLevel.toLowerCase()
        const currentIndex = LEVELS.findIndex(
            (level) => level.toLowerCase() === lowerLevel
        )

        if (currentIndex === -1) return 0
        if (currentIndex === LEVELS.length - 1) return 100 // Already at max level

        return PROGRESS_MAP[lowerLevel] || 0
    }

    const nextLevel = getNextLevel(user.level)
    const progress = calculateProgress(user.level)

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', my: 4, px: 2 }}>
            <Button
                component={Link}
                to="/"
                variant="contained"
                sx={{ mb: 4 }}
                startIcon={<ArrowBackIcon />}>
                Back to Users
            </Button>

            <Grid container spacing={3}>
                {/* User Profile Card */}
                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            height: '100%',
                            boxShadow: 3,
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}>
                        <Box
                            sx={{
                                bgcolor: getLevelColor(user.level),
                                py: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                color: ['gold', 'platinum'].includes(
                                    user.level.toLowerCase()
                                )
                                    ? 'black'
                                    : 'white',
                            }}>
                            <Avatar
                                sx={{
                                    width: 80,
                                    height: 80,
                                    bgcolor: 'white',
                                    color: getLevelColor(user.level),
                                    mb: 2,
                                    boxShadow: 2,
                                }}>
                                {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography
                                variant="h5"
                                component="h2"
                                gutterBottom
                                fontWeight="bold">
                                {user.name}
                            </Typography>
                            <Chip
                                label={user.level}
                                sx={{
                                    bgcolor: 'white',
                                    color: getLevelColor(user.level),
                                    fontWeight: 'bold',
                                    border: `2px solid ${getLevelColor(user.level)}`,
                                }}
                            />
                        </Box>
                    </Card>
                </Grid>

                {/* Achievement Details Card */}
                <Grid item xs={12} md={8}>
                    <Card
                        sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Typography
                                variant="h6"
                                component="h3"
                                gutterBottom>
                                Achievement Details
                            </Typography>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body1" gutterBottom>
                                    Current Level: <strong>{user.level}</strong>
                                </Typography>

                                {nextLevel !== 'Max Level' && (
                                    <>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mt: 2, mb: 1 }}>
                                            Progress to {nextLevel}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}>
                                            <Box sx={{ width: '100%', mr: 1 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={progress}
                                                    sx={{
                                                        height: 10,
                                                        borderRadius: 5,
                                                        backgroundColor:
                                                            '#e0e0e0',
                                                        '& .MuiLinearProgress-bar':
                                                            {
                                                                backgroundColor:
                                                                    getLevelColor(
                                                                        nextLevel.toLowerCase()
                                                                    ),
                                                            },
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ minWidth: 35 }}>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary">
                                                    {progress}%
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </>
                                )}

                                {nextLevel === 'Max Level' && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mt: 2 }}>
                                        Congratulations! You've reached the
                                        maximum achievement level.
                                    </Typography>
                                )}
                            </Box>

                            <Box sx={{ mt: 4 }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary">
                                    User ID: {user.userId}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default UserDetail
