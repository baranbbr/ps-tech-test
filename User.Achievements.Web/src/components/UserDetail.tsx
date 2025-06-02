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
} from '@mui/material'

import { useEffect } from 'react'

const UserDetail = () => {
	const { id } = useParams<{ id: string }>()
	const { user, loading, error, fetchUser } = useUserDetail()

	useEffect(() => {
		fetchUser(id)
	}, [id])

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
				<Button
					component={Link}
					to='/'
					variant='contained'
					sx={{ mt: 2 }}>
					Back to Users
				</Button>
			</Box>
		)
	}

	if (!user) {
		return (
			<Box textAlign='center' p={3}>
				<Typography>User not found.</Typography>
				<Button
					component={Link}
					to='/'
					variant='contained'
					sx={{ mt: 2 }}>
					Back to Users
				</Button>
			</Box>
		)
	}

	// Function to determine the color based on achievement level
	const getLevelColor = (level: string) => {
		switch (level.toLowerCase()) {
			case 'bronze':
				return '#cd7f32'
			case 'silver':
				return '#c0c0c0'
			case 'gold':
				return '#ffd700'
			case 'platinum':
				return '#e5e4e2'
			default:
				return 'primary'
		}
	}

	return (
		<Box sx={{ maxWidth: 600, mx: 'auto', my: 4 }}>
			<Button component={Link} to='/' variant='outlined' sx={{ mb: 3 }}>
				Back to Users
			</Button>

			<Card sx={{ mb: 3 }}>
				<CardContent>
					<Typography variant='h5' component='h2' gutterBottom>
						{user.name}
					</Typography>

					<Box display='flex' alignItems='center' mb={2}>
						<Typography
							variant='body1'
							color='text.secondary'
							mr={1}>
							Achievement Level:
						</Typography>
						<Chip
							label={user.level}
							sx={{
								bgcolor: getLevelColor(user.level),
								color: ['gold', 'silver', 'bronze'].includes(
									user.level.toLowerCase()
								)
									? 'black'
									: 'white',
								fontWeight: 'bold',
							}}
						/>
					</Box>

					<Typography variant='body2' color='text.secondary'>
						User ID: {user.userId}
					</Typography>
				</CardContent>
			</Card>
		</Box>
	)
}

export default UserDetail
