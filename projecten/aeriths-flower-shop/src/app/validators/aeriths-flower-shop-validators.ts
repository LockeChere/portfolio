import { FormControl, ValidationErrors } from "@angular/forms";

export class AerithsFlowerShopValidators {

    //whitespace validation
    static notOnlyWhitespace(control: FormControl) : ValidationErrors | null{

        //check if string only has ws
        if ((control.value !=null) && (control.value.trim().length === 0)){
            //invalid return error object
            return { 'notOnlyWhitespace': true };
        }
        else{
            return null;
        }
       
    }
}
