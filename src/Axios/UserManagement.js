import axios from "axios";

const URL = "http://localhost:8090/api/v1/"

const addNewUser = (data) => {
    return axios.post(URL + "user_um", data)
}

const getAllUsers = () => {
    return axios.get(URL + "all_users_um")
}

const loginUser = (data) => {
    return axios.post(URL + "user_validate", data)
}

const deleteUser = (id) => {
    return axios.delete(URL + "user_um/" + id)
}

const updateUser = (id, data) => {
    return axios.put(URL + "user_um/" + id, data)
}

const getUserByCount = () => {
    return axios.get(URL + "users_type")
}

const getUserByDate = () => {
    return axios.get(URL + "doctors_by_special")
}

export default { addNewUser, getAllUsers, loginUser, deleteUser, updateUser, getUserByCount, getUserByDate }