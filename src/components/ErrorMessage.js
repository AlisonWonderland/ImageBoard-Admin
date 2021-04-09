import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    errorContainer: {
        background: '#ed072a',
        width: '100%',
        textAlign: 'center'
    },
    text: {
        color: '#ffffee',
        fontSize: '18px'
    }
}));

const ErrorMessage = ({ error }) => {
    const classes = useStyles()
    // console.log('error in message', error)
    return (
        <>  
            {
                error ? 
                    <Container className={classes.errorContainer}>
                        <Typography variant="body1" gutterBottom className={classes.text}>
                            {error}
                        </Typography>
                    </Container>
                : null
            }   
        </>
    )
}

export default ErrorMessage