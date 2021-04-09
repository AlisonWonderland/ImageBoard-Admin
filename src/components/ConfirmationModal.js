import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import WarningIcon from '@material-ui/icons/Warning';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    },
    modalMessage: {
        fontSize: '18px',
        margin: '15px 0px 15px 0px'
    },
    warningIcon: {
        height: '50px',
        width: '50px',
        color: 'red'
    },
    iconContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '5px'
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 2),
    },
    buttonsContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
        marginTop: '10px'
    },
    confirmationButton: {
        marginRight: '5px'
    }
}));

const ConfirmationModal = ({ showModal, handleModalClose, handleConfirmation }) => {
    const classes = useStyles()

    return (
        <Modal
            open={showModal}
            onClose={handleModalClose}
            className={classes.modal}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div className={classes.paper}>
                <div className={classes.iconContainer}>
                    <WarningIcon className={classes.warningIcon}></WarningIcon>
                </div>
                <span className={classes.modalMessage}>
                    Are you sure you want to delete?
                </span>
                <div className={classes.buttonsContainer}>
                    <Button variant="contained" color="primary" onClick={handleModalClose} className={classes.confirmationButton}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleConfirmation} className={classes.confirmationButton}>
                        Delete
                    </Button>
                </div>
            </div>
        </Modal>

    )
}

export default ConfirmationModal