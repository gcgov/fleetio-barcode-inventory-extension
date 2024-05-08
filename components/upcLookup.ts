export interface IItem {
    category:string|undefined,
        description:string|undefined,
        ean:string|undefined,
        upc:string|undefined,
        images:string[]|undefined,
        title:string[]|undefined,
        //book
        isbn:string|undefined,
        publisher:string[]|undefined,
        //product
        brand:string|undefined,
        color:string|undefined,
        currency:string|undefined,
        dimension:string|undefined,
        highest_recorded_price:number|undefined,
        lowest_recorded_price:number|undefined,
        model:string|undefined,
        size:string|undefined,
        weight:string|undefined,
}
export default class upcLookup {

    public static baseUrl:string = 'https://api.upcitemdb.com/prod/trial/'

    constructor() {
    }

    static lookupUpc = async ( upc:string=''): Promise<IItem|null> => {
       const response = await fetch(upcLookup.baseUrl+'lookup?upc='+upc );
       const body = await response.json();
       if(body.code=='OK' && body.items[0]) {
           return body.items[0]
       }
       return null
    }

}
