import { useState } from 'react';
import adminService from '../services/adminService'
import jwt_decode from "jwt-decode";

export function useToken() {
    const getToken = tokenType => {
        if(tokenType === 'token') {
            let tokenString = sessionStorage.getItem('token');
            let userToken = JSON.parse(tokenString);
            
            // stored in local storage instead
            if(userToken === null) {
                tokenString = localStorage.getItem('token');
                userToken = JSON.parse(tokenString);
            }
            return userToken
        }
        else {
            let refreshTokenString = sessionStorage.getItem('refreshToken');
            let refreshToken = JSON.parse(refreshTokenString);

            if(refreshToken === null) {
                refreshTokenString = localStorage.getItem('token');
                refreshToken = JSON.parse(refreshTokenString);
            }
            return refreshToken
        }
    };
    
    const saveToken = (userToken, tokenStorageType) => {
        // console.log('token saved', userToken)
        if(tokenStorageType === 'local')
            localStorage.setItem('token', JSON.stringify(userToken));
        else
            sessionStorage.setItem('token', JSON.stringify(userToken));
        setRefreshToken(userToken);
    };

    const saveRefreshToken = (userToken, tokenStorageType) => {
        // console.log('token saved', refreshToken)
        if(tokenStorageType === 'local')
            localStorage.setItem('refreshToken', JSON.stringify(userToken));
        else
            sessionStorage.setItem('refreshToken', JSON.stringify(userToken));
        setRefreshToken(refreshToken);
    };

    const removeTokens = () => {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('refreshToken')
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        console.log('--------------------------')
        console.log('tokens removed')
        setToken(null)
        setRefreshToken(null)
    }



    const [token, setToken] = useState(getToken('token'));
    const [refreshToken, setRefreshToken] = useState(getToken('refreshToken'))
    // console.log('token outside func', token)


  return {
    setToken: saveToken,
    setRefreshToken: saveRefreshToken,
    removeTokens,
    token,
    refreshToken
  }
}

export function getPermissions() {
    
    let tokenString = sessionStorage.getItem('token');
    let userToken = JSON.parse(tokenString)

    if(userToken === null) {
        tokenString = localStorage.getItem('token');
        userToken = JSON.parse(tokenString)    
    }

    console.log('token decoded', jwt_decode(userToken))
    const { permissions } = jwt_decode(userToken)

    return permissions
}

export function getUsername() {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString)
    console.log('token decoded', jwt_decode(userToken))
    const { username } = jwt_decode(userToken)

    return username
}

// local storage
export function useUserSettings() {
    const getSettings = () => {
        // use getoken hook
        let settingsString = localStorage.getItem('settings');
        let settings = JSON.parse(settingsString);

        // console.log('token in getSettings:', settings)
        // console.log('token in getSettings plus data token:', userToken?.data.token)
        return settings
    };

    const [ settings, setSettings ] = useState(getSettings());
    // console.log('settings outside func', settings)

    const saveSettings = async (newSettings) => {
        localStorage.setItem('settings', JSON.stringify({...settings, ...newSettings}));
        // api call
        await adminService.updateSettings({settings: newSettings})
        setSettings(newSettings);
    };

    const initSettings = settings => {
        console.log('settings in init:', settings)
        localStorage.setItem('settings', JSON.stringify({...settings}));
        setSettings(settings)
    }

    // keep it, but settings are cleared in removeToken
    const removeSettings = () => {
        localStorage.removeItem('settings')
        console.log('--------------------------')
        console.log('settings removed')
        setSettings(null)
    }

  return {
    setSettings: saveSettings,
    initSettings,
    removeSettings,
    settings
  }

}

export const formatData = (data, postType) => {
    if(postType === 'threads' || postType === 'comments') {
        return data.map(post => {
            return {
                id: post.postNum,
                postNum: post.postNum,
                imageURL: post.url, 
                text: post.text,
                date: post.date
            }  
        })
    }
    else if(postType === 'admins') {
        return data.map(admin => {
            return {
                id: admin.username,
                username: admin.username,
                permissions: admin.permissions,
                commentsDeleted: admin.commentsDeleted,
                threadsDeleted: admin.threadsDeleted,
                totalDeleted: admin.totalPostsDeleted,
                lastDeletionDate: admin.lastDeltionDate
            }  
        })
    }
}

// non hook version of useToken
export function getTokenHeader() {
    let tokenString = sessionStorage.getItem('token');
    let tokenVal = JSON.parse(tokenString);
    
    if(tokenVal === null) {
        tokenString = localStorage.getItem('token');
        tokenVal = JSON.parse(tokenString);
    }

    // console.log('token from get header', tokenVal)
    return {'Authorization': `Bearer ${tokenVal}`}
}