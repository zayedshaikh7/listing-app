class ExpressError extends Error {
  constructor(status , message){
    super();
    this.status=Number(status);
    this.message=message;
  }
}
module.exports=ExpressError;
