import { join } from "path";

export function convertPath(filepath:string){
    if(filepath[0]=="/"||filepath[0]=="\\"||filepath[1]==":"){
        //绝对路径
        return filepath
    }else{
        return join(process.cwd(),filepath);
    }
}