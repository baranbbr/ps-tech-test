import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: 'flex',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}>
                        PS ACHIEVEMENTS
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Navbar
