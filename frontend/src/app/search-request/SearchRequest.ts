export default class SearchRequest{
    constructor(public id:string, public url:string, public datetime:string){}
}
class SearchTime{
    constructor(public sensorID: string, public startTime:string, public endTime: string){}
}