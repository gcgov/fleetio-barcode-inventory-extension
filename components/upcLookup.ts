export default class upcLookup {

    public static baseUrl:string = 'https://api.upcitemdb.com/prod/trial/'

    constructor() {
    }

    static lookupUpc = async ( upc:string='') => {
       const response = await fetch(upcLookup.baseUrl+'lookup?upc='+upc );
       const body = await response.json();
       if(body.code=='OK' && body.items[0]) {
           return body.items[0]
       }
       return null
    }

}
