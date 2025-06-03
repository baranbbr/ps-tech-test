import { useParams, Link } from 'react-router-dom'
import { useUserDetail } from '../hooks/useUserDetail'
import { useEffect } from 'react'
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
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { getLevelColour, getLevelTextColour } from '../constants'

const UserDetail = () => {
    const { id } = useParams<{ id: string }>()
    const { user, loading, error, fetchUser } = useUserDetail()

    useEffect(() => {
        if (id) {
            fetchUser(id)
            console.log('fetching user once')
        }
    }, [id, fetchUser])

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
                    sx={{
                        mt: 2,
                        bgcolor: '#2196f3',
                        '&:hover': {
                            bgcolor: '#42a5f5',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        },
                        transition: 'all 0.2s ease-in-out',
                    }}
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
                    sx={{
                        mt: 2,
                        bgcolor: '#2196f3',
                        '&:hover': {
                            bgcolor: '#42a5f5',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        },
                        transition: 'all 0.2s ease-in-out',
                    }}
                    startIcon={<ArrowBackIcon />}>
                    Back to Users
                </Button>
            </Box>
        )
    }

    // Using the imported getLevelColour function from constants

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', my: 4, px: 2 }}>
            <Button
                component={Link}
                to="/"
                variant="contained"
                sx={{
                    mb: 4,
                    bgcolor: '#2196f3',
                    '&:hover': {
                        bgcolor: '#42a5f5',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    },
                    transition: 'all 0.2s ease-in-out',
                }}
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
                                bgcolor: getLevelColour(user.level),
                                py: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                color: getLevelTextColour(user.level),
                            }}>
                            <Avatar
                                sx={{
                                    width: 80,
                                    height: 80,
                                    bgcolor: 'white',
                                    color: getLevelColour(user.level),
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
                                    color: getLevelColour(user.level),
                                    fontWeight: 'bold',
                                    border: `2px solid ${getLevelColour(user.level)}`,
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

                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body1" gutterBottom>
                                    Level: <strong>{user.level}</strong>
                                </Typography>
                            </Box>
                            <Box sx={{ mt: 2 }}>
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
