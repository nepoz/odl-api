import axios from 'axios'
import getStaffInfo from '../../src/utils/getStaffInfo'

const baseUrl = 'http://localhost:3001/api/members'

const getAll = () => {
    return axios.get(baseUrl)
}

const update = () => {
    return (
        axios
            .post(getStaffInfo())
    )
}

export default {
    getAll,
    update
}