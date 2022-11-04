import axios from "axios";

//base url
const URL = 'http://localhost:8090/api/v1/';

// get all companies and depots
const getCompanies = () => {
    return axios.get(URL + "delivery/companies");
}

// update order details by record id
const updateDeliveryDetails = (id, data) => {
    return axios.put(URL + "deliveryInfo/" + id, data);
}

// get all accepted orders
const getAcceptedOrders = () => {
    return axios.get(URL + "orders");
}

//export the created endpoints
export default { getCompanies, updateDeliveryDetails, getAcceptedOrders };