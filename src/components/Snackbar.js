import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}



const Snackbar1 = ({ showSnackbar, handleSnackbarClose, message, severity }) => {
    return (
        <Snackbar open={showSnackbar} autoHideDuration={7000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity={severity}>
                { message }
            </Alert>
        </Snackbar>
    )
}

export default Snackbar1