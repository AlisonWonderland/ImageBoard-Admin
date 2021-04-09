import axios from 'axios'
import { getTokenHeader } from '../helpers/helpers'
const authBaseURL = 'http://localhost:3001/api/authentication'
const adminBaseURL = 'http://localhost:3001/api/admin'


// one thing to note is that returning more than one item from route
// will cause axios to return the items in an res.data object
const login = async (userCrendtials) => {
    return await axios.post(`${authBaseURL}/login`, userCrendtials)
}

const addAdmin = async (newAdminData) => {
    return await axios.post(`${adminBaseURL}/add`, newAdminData)
}

const updatePassword = async (newPassword) => {
    const headers = getTokenHeader()
    return await axios.put(`${adminBaseURL}/password`, newPassword, {headers})
}

const updateSettings = async (newSettings) => {
    // console.log('header:', authHeader)
    const headers = getTokenHeader()
    return await axios.put(`${adminBaseURL}/updateSettings`, newSettings, {headers})
}

const refreshToken = async(headers) => {
    return await axios.post(`${authBaseURL}/refresh`, {}, headers)
}

export default 
{ 
    login,
    addAdmin,
    updatePassword,
    updateSettings,
    refreshToken
}