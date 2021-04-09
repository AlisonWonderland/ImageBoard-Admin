import { useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme, createMuiTheme, ThemeProvider  } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SettingsIcon from '@material-ui/icons/Settings';
import CommentIcon from '@material-ui/icons/Comment';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PeopleIcon from '@material-ui/icons/People';
import BallotIcon from '@material-ui/icons/Ballot';

import DataGrid from './DataGrid'
import AdminManagement from './AdminManagement'
import {
    Link,
    Switch,
    Route,
    useHistory,
    Redirect,
    useLocation,
    withRouter
} from 'react-router-dom';
import Settings from './Settings'

import { useToken, useUserSettings, getPermissions } from '../helpers/helpers';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  linkText: {
      textDecoration: "none"
  }
}));

const InitUserSettings = () => {
    const { settings, setSettings } = useUserSettings()
    console.log('settings in int', settings)
    // this won't be needed for admins for default values
    if(!Object.entries(settings)) {
        setSettings({darkMode: false})
        return({darkMode: false})
    }
    return settings
}

// do i need withrouter
const Home = withRouter((props) => {
    const { removeTokens, token } = useToken()
    const [ loggedOut, setLoggedOut ] = useState(false)
    const initSettings = InitUserSettings()
    const [ open, setOpen ] = useState(false);
    const classes = useStyles();
    // const history = useHistory()
    const [ darkMode, setDarkMode ] = useState(initSettings.darkMode);
    const palletType = darkMode ? "dark" : "light";
    const darkTheme = createMuiTheme({
        palette: {
            type: palletType,
        }
    });
        
    const theme = useTheme(darkTheme);
    console.log('token in home:', token)

    if(loggedOut) {
        console.log('logged out:', loggedOut)
        return <Redirect to="/" push />
    }
    
    if(!token) {
        // issure could be here
        return <Redirect to="/" push />
    }

    
    const permissions = getPermissions()

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleLogout = () => {
        removeTokens()
        setDarkMode(false)
        setLoggedOut(!loggedOut)
        // to fix ui bug
    }

    

  return (
    <ThemeProvider theme={darkTheme}>
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    className={clsx(classes.menuButton, open && classes.hide)}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap>
                    ImageBoard Administration
                </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
                </div>
                <Divider />
                <List className={classes.linkList}>
                    <Link to="/home" className={classes.linkText} style={{color: darkMode ? '#fff' : '#000000de'}}>
                        <ListItem button key="Threads" >
                                <ListItemIcon><BallotIcon /></ListItemIcon>
                                <ListItemText primary="Threads" />
                        </ListItem>
                    </Link>
                    <Link to="/home/comments" className={classes.linkText} style={{color: darkMode ? '#fff' : '#000000de'}}>
                        <ListItem button key="Comments">
                                <ListItemIcon><CommentIcon /></ListItemIcon>
                                <ListItemText primary="Comments" />
                        </ListItem>
                    </Link>
                </List>
                <Divider />
                {/* load super admin components separately with a display style */}
                <List>
                    {   permissions === 'super' && 
                        <Link to="/home/adminManagement" className={classes.linkText} style={{color: darkMode ? '#fff' : '#000000de'}}>
                            <ListItem button key="Manage Admins">
                                    <ListItemIcon><PeopleIcon /></ListItemIcon>
                                    <ListItemText primary="Manage Admins" />
                            </ListItem>
                        </Link>
                    }
                    <Link to="/home/settings" className={classes.linkText} style={{color: darkMode ? '#fff' : '#000000de'}}>
                        <ListItem button key="Settings">
                                <ListItemIcon><SettingsIcon /></ListItemIcon>
                                <ListItemText primary="Settings" />
                        </ListItem>
                    </Link>
                    <ListItem button key="Logout" onClick={handleLogout} style={{color: darkMode ? '#fff' : '#000000de'}}>
                            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                            <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Drawer>
            <main
                className={clsx(classes.content, {
                [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                <Switch>
                    <Route path="/home/settings">
                        {/* pass in token to get user info */}
                        <Settings token={token} setDarkMode={setDarkMode} darkMode={darkMode} />
                    </Route>
                    <Route path="/home/adminManagement">
                        <AdminManagement token={token} />
                    </Route>
                    {/* 
                        keys are needed here so that the component can rerender on props change. otherwise selections would remain
                        after switching to another postType
                    */}
                    <Route path="/home/comments">
                        <DataGrid key='comments' postType={'comments'} darkMode={darkMode} />
                    </Route>
                    <Route path="/home">
                        <DataGrid key='threads' postType={'threads'} darkMode={darkMode} />
                    </Route>
                </Switch>
            </main>
        </div>
    </ThemeProvider>
  );
})

export default Home