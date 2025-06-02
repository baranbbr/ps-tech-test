import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {
    Container,
    CssBaseline,
    ThemeProvider,
    createTheme,
} from '@mui/material'
import UserList from './components/UserList'
import UserDetail from './components/UserDetail'
import Navbar from './components/Navbar'

// Create a theme with ps inspired colors
const theme = createTheme({
    palette: {
        primary: {
            main: '#006FCD', // ps blue
        },
        secondary: {
            main: '#000000', // black
        },
        background: {
            default: '#f5f5f5',
        },
    },
    typography: {
        fontFamily: '"Helvetica", "Arial", sans-serif',
    },
})

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Navbar />
                <Container maxWidth="lg">
                    <Routes>
                        <Route path="/" element={<UserList />} />
                        <Route path="/users/:id" element={<UserDetail />} />
                    </Routes>
                </Container>
            </Router>
        </ThemeProvider>
    )
}

export default App
