import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true
})

//user
export const registerUser = payload => api.post(`/user/signup`, payload)
export const loginUser = payload => api.post(`/user/signin`, payload)
export const logoutUser = () => api.get(`/user/signout`)
export const loggedUser = () => api.get(`user/logged`)

//competition
export const createComp = payload => api.post(`/comp/create`, payload)
export const updateComp = (join_id,payload) => api.put(`/comp/${join_id}`, payload)
export const activateComp = (join_id) => api.get(`/comp/activate/${join_id}`)
export const deactivateComp = (join_id) => api.get(`/comp/deactivate/${join_id}`)
export const deleteCompetition = (join_id) => api.delete(`/comp/delete/${join_id}`)
export const joinComp = (join_id, payload) => api.put(`/comp/join/${join_id}`, payload)
export const getComps = (creator) => api.get(`/comps/${creator}`)
export const getCompByJoinID = join_id => api.get(`/comp/${join_id}`)

//competition flaw
export const getProbFlawInfo = (join_id, payload) => api.put(`/comp/flaw/${join_id}`, payload)
export const updateProbFlawInfo = (join_id, payload) => api.put(`/comp/flaw/update/${join_id}`,payload)

//problem
export const submitProblem = payload => api.post(`/problem`, payload)
export const updateProblem = (problem_id, payload) => api.put(`/problem/${problem_id}`, payload)
export const getProblems = () => api.get(`/problem`)
export const getProblemByProblemID = (problem_id) => api.get(`/problem/${problem_id}`)


const apis = {
    registerUser,
    loginUser,
    logoutUser,
    loggedUser,
    createComp,
    updateComp,
    activateComp,
    deactivateComp,
    deleteCompetition,
    joinComp,
    getComps,
    getCompByJoinID,
    submitProblem,
    updateProblem,
    getProblemByProblemID,
    getProblems,
    getProbFlawInfo,
    updateProbFlawInfo
}

export default apis
