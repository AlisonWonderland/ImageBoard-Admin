import axios from 'axios'
import { getTokenHeader } from '../helpers/helpers'
// const baseUrl = 'http://localhost:3001/api'
const threadApiURL = 'http://localhost:3001/api/threads'
const commentApiURL = 'http://localhost:3001/api/comment'
const adminApiURL = 'http://localhost:3001/api/admin' 

const getThreads = async () => {
    return await axios.get(threadApiURL)
}

const getComments = async () => {
    return await axios.get(commentApiURL + '/')
}

const getAdmins = async () => {
    return await axios.get(adminApiURL + '/')
}

const deleteThreads = async(postNums) => {
    const headers = getTokenHeader()
    return await axios.delete(`${threadApiURL}/multiple`, {headers, data: {postNums: postNums}})
}

const deleteComments = async(postNums) => {
    const headers = getTokenHeader()
    return await axios.delete(`${commentApiURL}/multiple`, {headers, data: {postNums: postNums}})
}

const deleteAdmins= async(adminUsernames) => {
    const headers = getTokenHeader()
    return await axios.delete(`${adminApiURL}/multiple`, {headers, data: {usernames: adminUsernames}})
}


export default 
{ 
    getThreads,
    getComments,
    getAdmins,
    deleteThreads,
    deleteComments,
    deleteAdmins
}