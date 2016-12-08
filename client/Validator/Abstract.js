
class AbstractValidator{

  constructor(){
    this.message = "";
  }

  validate(){
    throw new Error("This method must be implemented in the concrete class");
  }

  getMessage(){
    return this.message;
  }

  setMessage(txt){
    this.message = txt;
  }

}

export default AbstractValidator;
