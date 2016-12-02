"use strict";

class FormValidationError{

    constructor(text, element){
        this.text = text;
        this.element = element;
    }

    get message(){
        return this.text;
    }

    getFieldName(){
        return this.element;
    }
}


export default FormValidationError;