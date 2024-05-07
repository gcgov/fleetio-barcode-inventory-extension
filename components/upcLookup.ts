import axios from "axios";

export default class upcLookup {

    public static baseUrl:string = 'https://api.upcitemdb.com/prod/trial/'

    constructor() {
    }

    static lookupUpc = async ( upc:string='') => {
       return axios.get(upcLookup.baseUrl+'lookup?upc='+upc)
    }

}
