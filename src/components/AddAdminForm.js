import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import ErrorMessage from './ErrorMessage'

import adminService from '../services/adminService'
import { useToken } from  '../helpers/helpers'

const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
    form: {
        display: 'flex',
        alignItems: 'center'
    },
    button: {
        height: '50%'
    }
}));


// we can have snack bar saying refresh to see new admins
const AddAdminForm = ({ setSnackbarState }) => {
    const [ superAdmin, setSuperAdmin ] = useState(false)
    const [ viewOnly, setViewOnly ] = useState(false)
    const [ editOnly, setEditOnly ] = useState(false)
    const [ username, setUsername ] = useState('')
    const [ error, setError ] = useState(null)
    const classes = useStyles();


    const { token } = useToken()
    console.log('token in admin form', token)
   
    // add to rows here
    const handleSubmit = async (e) => {
        e.preventDefault()

        // have to check for these since required won't stop form submit
        if(!(viewOnly || editOnly || superAdmin)) {
            setError('Please select permissions for new admin')
            return
        }

        let permissions = ''

        if(viewOnly) {
            permissions = 'view'
        }
        else if(editOnly) {
            permissions = 'edit'
        }
        else {
            permissions = 'super'
        }

        try {
            
            const newAdmin = await adminService.addAdmin({
                    username: username,
                    password: 'password',
                    permissions
            })
            console.log('new admin', newAdmin)
            setError(null)
            setUsername('')
            setSuperAdmin(false)
            setViewOnly(false)
            setEditOnly(false)
            setSnackbarState({
                show: true, 
                severity: 'success',
                message: 'Admin successfully added. Refresh to see.'
            })
        }
        catch(err) {
            console.log('error:', err)
            if(err.response.data.messages)
                setError(err.response.data.messages)
            else
                setError('Unknown error occured')
        }
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }



    return (
        <div>
            <ErrorMessage error={error} />
            <form className={classes.root} onSubmit={handleSubmit} noValidate autoComplete="off">
                <div className={classes.form}>
                    <TextField
                        required
                        id="admin-username"
                        label="username"
                        variant="filled"
                        onChange={handleUsernameChange}
                        value={username}
                    />
                    <TextField
                        disabled
                        id="password"
                        label="Disabled"
                        defaultValue="password"
                        variant="filled"
                    />
                    <FormControlLabel
                        control={
                        <Checkbox
                            required
                            checked={superAdmin}
                            disabled={viewOnly || editOnly ? true : false}
                            onChange={() => setSuperAdmin(!superAdmin)}
                            name="check"
                            color="primary"
                        />
                        }
                        label="Super admin(Edit permissions + can add/delete admins)"
                    />
                    <FormControlLabel
                        control={
                        <Checkbox
                            checked={viewOnly}
                            disabled={superAdmin || editOnly ? true : false}
                            onChange={() => setViewOnly(!viewOnly)}
                            name="check"
                            color="primary"
                        />
                        }
                        required
                        label="View permissions only"
                    />
                    <FormControlLabel
                        control={
                        <Checkbox
                            checked={editOnly}
                            disabled={viewOnly || superAdmin ? true : false}
                            onChange={() => setEditOnly(!editOnly)}
                            name="check"
                            color="primary"
                        />
                        }
                        label="Edit permissions only"
                    />
                    <Button variant="contained" color="primary" type="submit" className={classes.button}>
                        Add user
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default AddAdminForm