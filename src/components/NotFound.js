import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
        height: '100%'
    },
    loginLink: {
        fontSize: '20px'
    }
}));

const NotFound = () => {
    const classes = useStyles()

    return (
        <div className={classes.container}>
            <Typography variant="h1" component="h1" gutterBottom>
                404
            </Typography>
            <Typography variant="h2" component="h2" gutterBottom>
                Page not found
            </Typography>
            <a href="/" className={classes.loginLink}>Go to login page</a>
        </div>
    )
}

export default NotFound