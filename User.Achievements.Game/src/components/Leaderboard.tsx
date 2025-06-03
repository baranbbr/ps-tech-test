import React from 'react'
import type { Player } from '../types'

interface LeaderboardProps {
	users: Player[]
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ users }) => {
	// Sort users by score (coins collected)
	const sortedUsers = [...users].sort((a, b) => {
		// Get score from snake length divided by 10 (since we add 10 segments per coin)
		const scoreA = Math.ceil((a.snakeSegments?.length ?? 0) / 10)
		const scoreB = Math.ceil((b.snakeSegments?.length ?? 0) / 10)
		return scoreB - scoreA
	})

	// Get color based on level (for aesthetics only)
	const getLevelColor = (level: string) => {
		switch (level) {
			case 'Platinum':
				return '#E5E4E2'
			case 'Gold':
				return '#FFD700'
			case 'Silver':
				return '#C0C0C0'
			case 'Bronze':
				return '#CD7F32'
			default:
				return '#808080'
		}
	}

	return (
		<div
			style={{
				position: 'absolute',
				top: '20px',
				right: '20px',
				backgroundColor: 'rgba(0, 0, 0, 0.7)',
				padding: '15px',
				borderRadius: '10px',
				color: 'white',
				minWidth: '200px',
				zIndex: 1000,
			}}>
			<h3 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>
				Leaderboard
			</h3>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '8px',
				}}>
				{sortedUsers.map((user, index) => (
					<div
						key={user.userId}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '10px',
							padding: '5px',
							backgroundColor: 'rgba(255, 255, 255, 0.1)',
							borderRadius: '5px',
						}}>
						<span
							style={{
								color: getLevelColor(user.level),
								fontWeight: 'bold',
							}}>
							#{index + 1}
						</span>
						<span style={{ flex: 1 }}>{user.name}</span>
						<span style={{ color: '#4CAF50', fontWeight: 'bold' }}>
							{Math.ceil((user.snakeSegments?.length ?? 0) / 10)}{' '}
							coins
						</span>
						<span
							style={{
								color: getLevelColor(user.level),
								fontSize: '0.9em',
							}}>
							{user.level}
						</span>
					</div>
				))}
			</div>
		</div>
	)
}

export default Leaderboard
