import { API_URL } from './lib';
import axios from 'axios';

const URL = `${API_URL}/voucher`;

export const getVouchers = async () => {
    const response = await axios.get(URL, {
        withCredentials:true
    })
    return response.data
}