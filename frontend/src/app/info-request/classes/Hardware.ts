export default class Hardware{
    public id:string;
    public detail:{
        tag: string;
        type: string;
    }
    constructor(id:string, tag:string, type:string){
        this.id = id;
        this.detail = {
            tag : tag,
            type : type
        }
    }

}