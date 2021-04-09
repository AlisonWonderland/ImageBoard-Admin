import { useState } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import LinearProgress from '@material-ui/core/LinearProgress'

import adminService from '../services/adminService'

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';

import ErrorMessage from './ErrorMessage'
import { useHistory, Redirect } from "react-router-dom";
import { useUserSettings, useToken } from '../helpers/helpers'

const useStyles = makeStyles((theme) => ({
    root: {
        background: 'blue',
        flexGrow: 1,
        height: '100vh'
    },
    '*': {
        color: '#000 !important'
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    gridContainer: {
        height: '100%'
    },
    grid: {
        height: '100%'
    },
    container: {
        background: '#fcf7f8',
        height: '100%'
    },
    left: {
        background: '#b53f51'
    },
    formContainer: {
        display: 'flex',
        "justifyContent": "center",
        "alignItems": 'center',
        "flexDirection": 'column',
    },
    form: {
    }
}));

// need to hardcode light theme to prevent it from using dark mode after logout
const Login = () => {
    const lightTheme = createMuiTheme({
        palette: {
            type: 'light',
        }
    })

    const classes = useStyles()
    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ showPassword, setShowPassword ] = useState(false)
    const [ error, setError ] = useState(null)
    const [ staySignedIn, setStaySignedIn ] = useState(false)
    const [ showProgressBar, setShowProgressBar ] = useState(false);
    const { token, setToken, setRefreshToken } = useToken()
    const { initSettings } = useUserSettings()
    const history = useHistory();

    // console.log('login rendered', token)

    if(token) {
        return <Redirect to='/home' push />
    }
    
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };

    // this is was included from material ui docs
    const handleMouseDownPassword = (e) => {
        e.preventDefault();
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const handleStaySignedCheck = () => {
        setStaySignedIn(!staySignedIn)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setShowProgressBar(!showProgressBar)
        try {
            const {data: {token, refreshToken, settings}} = await adminService.login({ username, password })
            const tokenStorageType = staySignedIn ? 'local' : 'session'
            setToken(token, tokenStorageType)
            setRefreshToken(refreshToken, tokenStorageType)
            initSettings(settings)
            
            if(window.location.pathname === '/')
                history.push('/home')
        }
        catch(err) {
            console.log(err)
            console.log(err.response)
            if(err.response === undefined) {
                setError('Can\'t connect to server')
            }
            else {
                setError(err.response.data.error)
                console.log('data error', err.response.data.error)
            }
        }
        setShowProgressBar(!showProgressBar)
    }
    
    return (
        <ThemeProvider theme={lightTheme}>
        <div className={classes.root}>
            <CssBaseline />
            <Grid container spacing={0} className={classes.gridContainer}>
                <Hidden xsDown>
                    <Grid item sm={6}>
                        <Container className={`${classes.left} ${classes.container}`}>
                            <></>
                        </Container>
                    </Grid>
                </Hidden>
                <Grid item xs={12} sm={6}>
                    <Container className={`${classes.container} ${classes.formContainer}`}>
                        <Typography variant="h5" component="h1" gutterBottom>
                            ImageBoard Admin
                        </Typography>


                        <form noValidate autoComplete="off" onSubmit={handleSubmit} className={classes.form}>
                            <LinearProgress style={{height: '10px', display: showProgressBar ? '' : 'none'}} />
                            <ErrorMessage error={error} />
                            <TextField 
                                id="standard-basic" 
                                label="username" 
                                margin="normal" 
                                fullWidth 
                                value={username}
                                onChange={handleUsernameChange} 
                            />
                            <FormControl fullWidth>
                                <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                                <Input
                                    id="standard-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={handlePasswordChange}
                                    endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                    }
                                />
                            </FormControl>
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Stay signed in"
                                onChange={handleStaySignedCheck}
                            />
                            <Button variant="contained" color="primary" type="submit" fullWidth >
                                Sign in
                            </Button>
                        </form>
                    </Container>
                </Grid>
            </Grid>
        </div>
        </ThemeProvider>
    )
}

export default Login