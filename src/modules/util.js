
export const writeUserToDB = (dbConnect,pseudo,mail,uid="",password="") =>{
    const tableName = "Users";
    if(!uid){
        dbConnect.pushData(tableName,{firstname:pseudo,mail:mail,password:password});
    }else{
        dbConnect.setData(tableName+"/"+uid,{firstname:pseudo,mail:mail,password:password})
    }
}
