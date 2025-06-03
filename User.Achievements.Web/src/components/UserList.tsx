import { Link } from 'react-router-dom'
import { useUsers } from '../hooks/useUsers'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    CircularProgress,
    TextField,
    InputAdornment,
    Chip,
    Grid,
    Card,
    CardContent,
    Button,
    Stack,
    Divider,
    Autocomplete,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import PersonIcon from '@mui/icons-material/Person'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { useEffect, useState } from 'react'

// Define colors for achievement levels
const LEVEL_COLORS: Record<string, string> = {
    bronze: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700',
    platinum: '#0070FF', // Brighter, more vibrant blue
}

const UserList = () => {
    const {
        filteredUsers,
        loading,
        error,
        fetchUsers,
        searchUsers,
        searchTerm,
        users,
    } = useUsers()
    const [searchInputValue, setSearchInputValue] = useState('')

    useEffect(() => {
        fetchUsers()
    }, [])

    // Handle search when user stops typing
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchInputValue !== searchTerm) {
                searchUsers(searchInputValue)
            }
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [searchInputValue, searchUsers, searchTerm])

    // Calculate statistics
    const calculateStats = () => {
        if (!users || users.length === 0) return { total: 0, levels: {} }

        const levels = users.reduce((acc: any, user: any) => {
            const level = user.level.toLowerCase()
            acc[level] = (acc[level] || 0) + 1
            return acc
        }, {})

        return {
            total: users.length,
            levels,
        }
    }

    const stats = calculateStats()

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
            </Box>
        )
    }

    return (
        <Box sx={{ width: '100%', mb: 4 }}>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 'bold', color: '#333' }}>
                User Achievement Dashboard
            </Typography>

            {/* Statistics Overview */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card
                        sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={1}>
                                <PersonIcon
                                    sx={{ mr: 1, color: 'primary.main' }}
                                />
                                <Typography color="textSecondary" variant="h6">
                                    Total Users
                                </Typography>
                            </Box>
                            <Typography
                                variant="h3"
                                sx={{ fontWeight: 'bold' }}>
                                {stats.total}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Card
                        sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={1}>
                                <EmojiEventsIcon
                                    sx={{ mr: 1, color: 'primary.main' }}
                                />
                                <Typography color="textSecondary" variant="h6">
                                    Achievement Levels
                                </Typography>
                            </Box>
                            <Stack direction="row" spacing={2} flexWrap="wrap">
                                {Object.entries(stats.levels).map(
                                    ([level, count]) => (
                                        <Chip
                                            key={level}
                                            label={`${level}: ${count}`}
                                            sx={{
                                                bgcolor: LEVEL_COLORS[level],
                                                color: [
                                                    'gold',
                                                    'platinum',
                                                ].includes(level)
                                                    ? 'black'
                                                    : 'white',
                                                fontWeight: 'bold',
                                                fontSize: '0.9rem',
                                                py: 2,
                                            }}
                                        />
                                    )
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Enhanced Search Bar */}
            <Card
                sx={{
                    mb: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    overflow: 'hidden',
                }}>
                <CardContent sx={{ p: 2 }}>
                    <Typography
                        variant="h6"
                        sx={{ mb: 2, fontWeight: 'medium' }}>
                        Search Users
                    </Typography>
                    <Autocomplete
                        freeSolo
                        options={users?.map((user) => user.name) || []}
                        inputValue={searchInputValue}
                        onInputChange={(_, newValue) => {
                            setSearchInputValue(newValue)
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Enter username..."
                                variant="outlined"
                                fullWidth
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ bgcolor: 'white', borderRadius: 1 }}
                            />
                        )}
                    />
                </CardContent>
            </Card>

            <Divider sx={{ mb: 3 }} />

            {filteredUsers.length === 0 ? (
                <Box textAlign="center" p={4}>
                    <Typography variant="h6" color="text.secondary">
                        No users found matching your search
                    </Typography>
                    {searchTerm && (
                        <Button
                            variant="outlined"
                            sx={{ mt: 2 }}
                            onClick={() => {
                                setSearchInputValue('')
                                searchUsers('')
                            }}>
                            Clear Search
                        </Button>
                    )}
                </Box>
            ) : (
                <TableContainer
                    component={Paper}
                    sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="users table">
                        <TableHead sx={{ bgcolor: 'primary.main' }}>
                            <TableRow>
                                <TableCell
                                    sx={{ color: 'white', fontWeight: 'bold' }}>
                                    User ID
                                </TableCell>
                                <TableCell
                                    sx={{ color: 'white', fontWeight: 'bold' }}>
                                    Name
                                </TableCell>
                                <TableCell
                                    sx={{ color: 'white', fontWeight: 'bold' }}>
                                    Achievement Level
                                </TableCell>
                                <TableCell
                                    sx={{ color: 'white', fontWeight: 'bold' }}>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.userId} hover>
                                    <TableCell>{user.userId}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.level}
                                            sx={{
                                                bgcolor:
                                                    LEVEL_COLORS[
                                                        user.level.toLowerCase()
                                                    ],
                                                color: [
                                                    'gold',
                                                    'platinum',
                                                ].includes(
                                                    user.level.toLowerCase()
                                                )
                                                    ? 'black'
                                                    : 'white',
                                                fontWeight: 'bold',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            component={Link}
                                            to={`/users/${user.userId}`}
                                            variant="contained"
                                            size="small"
                                            sx={{ borderRadius: 2 }}>
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    )
}

export default UserList
