import axios from 'axios'
import { useToken } from './helpers'

function getNewToken() {
    console.log('new token  called')
}

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
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log('error status:', error.response.status)
    console.log('error response from interceptor:', error.response)
    if(error.response.status === 401) {
        // old token
        console.log('reached')
        try {

            const { token } = useToken()
        }
        catch(err) {
            console.log('err in ', err)
        }
        // console.log(token)
        // call refresh route to get new access token
        const newToken = getNewToken()
        // if refresh router returns with error(expired token) we cause the user to log out

    }
    else {
        console.log('non unauthorized error')
    }
    return Promise.reject(error);
});