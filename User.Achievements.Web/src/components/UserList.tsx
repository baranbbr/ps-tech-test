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
} from '@mui/material'
import { useEffect } from 'react'

const UserList = () => {
	const { users, loading, error, fetchUsers } = useUsers()

	useEffect(() => {
		fetchUsers()
	}, [])

	if (loading) {
		return (
			<Box
				display='flex'
				justifyContent='center'
				alignItems='center'
				minHeight='200px'>
				<CircularProgress />
			</Box>
		)
	}

	if (error) {
		return (
			<Box textAlign='center' p={3}>
				<Typography color='error'>{error}</Typography>
			</Box>
		)
	}

	return (
		<Box sx={{ width: '100%', mb: 4 }}>
			<Typography variant='h4' component='h1' gutterBottom>
				User Achievement Levels
			</Typography>

			{users.length === 0 ? (
				<Typography>No users found.</Typography>
			) : (
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label='users table'>
						<TableHead>
							<TableRow>
								<TableCell>User ID</TableCell>
								<TableCell>Name</TableCell>
								<TableCell>Achievement Level</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{users.map((user) => (
								<TableRow key={user.userId}>
									<TableCell>{user.userId}</TableCell>
									<TableCell>{user.name}</TableCell>
									<TableCell>{user.level}</TableCell>
									<TableCell>
										<Link to={`/users/${user.userId}`}>
											View Details
										</Link>
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
