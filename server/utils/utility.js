const responseError = (res,errorCode=500,error={},message)=>{
    console.log(error)

    if(errorCode==500){
        res.status(errorCode).send({message : message || "Internal Server Error",error: error})
    }else if(errorCode==404){
        res.status(errorCode).send({message :message || "Not Found",error: error})  
    }
    else if(errorCode==400){
        res.status(errorCode).send({message :message || "Bad request",error: error})  
    }
    else if(errorCode==401){
        res.status(errorCode).send({message : message ||"Forbidden",error: error})  
    }
    else if(errorCode==403){
        res.status(errorCode).send({message : message ||"Unauthorized",error: error})  
    }
    else if(errorCode==409){
        res.status(errorCode).send({message : message || "ConflictedData",error: error})  
    }
   
}

module.exports = {
    responseError
}