import { useState} from 'react';
import AddAdminForm from './AddAdminForm'
import DataGrid from './DataGrid'
import Snackbar from './Snackbar'

const AdminManagement = () => {
    const [ snackbarState, setSnackbarState ] = useState({
        show: false, 
        severity: 'success',
        message: ''
    });

    const handleSnackbarClose = () => {
        setSnackbarState({...snackbarState, show: !snackbarState.show})
    }
    
    return (
        <>
            <h1>AdminManagement</h1>
            <h2>Add admins</h2>
            <AddAdminForm setSnackbarState={setSnackbarState}/>
            <DataGrid postType={"admins"}/>
            <Snackbar
                showSnackbar={snackbarState.show}
                message={snackbarState.message}
                severity={snackbarState.severity}
                handleSnackbarClose={handleSnackbarClose}
            >
            </Snackbar>
        </>
    )
}

export default AdminManagement