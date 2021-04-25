import Login from './components/Login'
import Home from './components/Home'
import NotFound from './components/NotFound'
import adminService from './services/adminService'


import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';

import './App.css';


import axios from 'axios'

axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    console.log('config from interceptor', config)
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    return response;
  }, async function (error) {    
    let refreshTokenString = sessionStorage.getItem('refreshToken');
    let refreshToken = JSON.parse(refreshTokenString);
    
    if(refreshToken === null) {
        refreshTokenString = localStorage.getItem('refreshToken');
        refreshToken = JSON.parse(refreshTokenString);
    }

    const originalRequest = error.config

    console.log('config:', originalRequest)
    // checking for acces token expiration. Otherwise 401 error will come from login and obviously there are no tokens at the time
    // this may be an issue for the remember me feature, which has tokens stored in local storage.
    if(error.response.status === 401 && refreshToken && !originalRequest._retry && !error.response.data.intercepted) {
        // call refresh route to get new access token
        try {
            originalRequest._retry = true
            
            const {data: { newAccessToken }} = await adminService.refreshToken({headers: {'Authorization': `Bearer ${refreshToken}`}})
            
            sessionStorage.setItem('token', JSON.stringify(newAccessToken));

            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
            return axios.request(originalRequest)
        }
        catch(err) {
            // if refresh router returns with error(expired token) we cause the user to log out
            sessionStorage.clear()
            // hacky way to return, but only one that works!
            return window.location.href = '/'
        }

    }
    else {
        console.log('non unauthorized error')
    }
    return Promise.reject(error);
});

function App() {
    return (
        <>
            <Router>
                <Switch>
                    <Route path="/home">
                        <Home/>
                    </Route>
                    <Route exact path="/">
                        <Login />
                    </Route>
                    <Route>
                        <NotFound />
                    </Route>
                </Switch>
            </Router>
        </>
    );
}

export default App;
