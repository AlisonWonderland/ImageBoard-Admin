import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import BrushIcon from '@material-ui/icons/Brush';
import AccountBoxIcon from '@material-ui/icons/AccountBox';import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import ErrorMessage from './ErrorMessage'

import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';

import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';

import Switch from '@material-ui/core/Switch';

import adminService from '../services/adminService'
import { useUserSettings, useToken, getUsername } from '../helpers/helpers'

const useStyles = makeStyles((theme) => ({
    errorContainer: {
        background: '#d94f4f'
    },
    text: {
        color: '#ffffee'
    },
    updateButton: {
        margin: '10px 0px 10px 0px'
    }
}));

// use memo

const Settings = ({ setDarkMode, darkMode }) => {
    const [ currentPassword, setCurrentPassword ] = useState('')
    const [ newPassword, setNewPassword ] = useState('')
    const [ confirmPassword, setConfirmPassword ] = useState('')
    const [ showCurrentPassword, setShowCurrentPassword ] = useState(false)
    const [ showNewPassword, setShowNewPassword ] = useState(false)
    const [ showConfirmPassword, setShowConfirmPassword ] = useState(false)
    const [ passwordErrors, setPasswordErrors ] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    })
    const [ error, setError ] = useState(null)
    const { setSettings } = useUserSettings()
    const { token } = useToken()
    const username = getUsername()

    const classes = useStyles()

    // console.log('sesttings refreshed')

    const handleCurrentPasswordChange = (e) => {
        setCurrentPassword(e.target.value)
    }

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value)
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(newPassword !== confirmPassword) {
            setError('Password confirmation must match new password')
            setPasswordErrors({...passwordErrors, newPassword: true, confirmPassword: true})
            return
        }

        // upload
        try {
            await adminService.updatePassword({ currentPassword, newPassword, token })
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
            
            // prevents unnecessary rerender
            if(error)
            {
                setError(null)
                setPasswordErrors({
                    currentPassword: false,
                    newPassword: false,
                    confirmPassword: false
                })
            }
        }
        catch(err) {
            if(err.response.data.currentPasswordError !== undefined) {
                setPasswordErrors({newPassword: false, confirmPassword: false, currentPassword: true})
            }
            else {
                setPasswordErrors({...passwordErrors, newPassword: false, confirmPassword: false})
            }
            setError(err.response.data.messages)
        }
    }

    const handleMouseDownPassword = (e) => {
        e.preventDefault();
    };

    const handleShowCurrentPassword = () => {
        setShowCurrentPassword(!showCurrentPassword)
    }

    const handleShowNewPassword = () => {
        setShowNewPassword(!showNewPassword)
    }

    const handleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    const handleDarkModeChange = () => {
        // change theme here
        setSettings({darkMode: !darkMode})
        setDarkMode(!darkMode)
    }

    return (
        <>  
            <Typography variant="h2" component="h1" gutterBottom>
                Settings
            </Typography>
            <div>
                {/* Each could be self contained component */}
                <Typography variant="h4" component="h2" gutterBottom>
                    <AccountBoxIcon /> Profile
                </Typography>
                <Typography variant="h6" component='span' gutterBottom>
                    Username: {username}
                </Typography>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography className={classes.heading}>Change password</Typography>
                    </AccordionSummary>
                    
                    
                    <AccordionDetails>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <ErrorMessage error={error} style={{width: '500px', height: '50px'}} />
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="standard-adornment-password">current password*</InputLabel>
                                    <Input
                                        id="standard-adornment-current-password"
                                        required
                                        error={passwordErrors.currentPassword}
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        value={currentPassword}
                                        onChange={handleCurrentPasswordChange}     
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                aria-label="toggle current password visibility"
                                                onClick={handleShowCurrentPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                >
                                                {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="standard-adornment-password">new password*</InputLabel>
                                    <Input
                                        id="standard-adornment-new-password"
                                        required
                                        error={passwordErrors.newPassword}
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={handleNewPasswordChange}     
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                aria-label="toggle new password visibility"
                                                onClick={handleShowNewPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                >
                                                {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="standard-adornment-password">confirm password*</InputLabel>
                                    <Input
                                        id="standard-adornment-confirm-password"
                                        required
                                        error={passwordErrors.confirmPassword}
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}     
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                aria-label="toggle confirm password visibility"
                                                onClick={handleShowConfirmPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                >
                                                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                                <Button variant="contained" color="primary" type="submit" className={classes.updateButton}>
                                    Update Password
                                </Button>
                            </div>
                        </form>
                    </AccordionDetails>
                </Accordion>
            </div>
            
            <div>
                <Typography variant="h4" component="h2" gutterBottom>
                    <BrushIcon /> Preferences
                </Typography>
                <Typography variant="body1">
                    Dark Mode:  <Switch
                        checked={darkMode}
                        onChange={handleDarkModeChange}
                        color="primary"
                        name="dark mode switch"
                        inputProps={{ 'aria-label': 'dark mode checkbox' }}
                    />
                </Typography>

            </div>

        </>
    )
}

export default Settings