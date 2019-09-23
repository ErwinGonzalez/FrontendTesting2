export default class Hardware{
    public id:string;
    public det:{
        tag: string;
        type: string;
    }
    constructor(id:string, tag:string, type:string){
        this.id = id;
        this.det = {
            tag : tag,
            type : type
        }
    }

}