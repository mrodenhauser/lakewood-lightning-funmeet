const jqueryScript = document.createElement('script2');
jqueryScript.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
jqueryScript.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(jqueryScript);

const validationsScript = document.createElement('script2');
validationsScript.src = '/scripts/validation.js';
validationsScript.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(validationsScript);

const submitScript = (e) => {
    try {
        let email = document.getElementById('iEmail').val();
        let password1 = document.getElementById('iPassword1').val();
        let password2 = document.getElementById('iPassword2').val();
        let firstName = document.getElementById('iFirstName').val();
        let nickName = document.getElementById('iNickName').val();
        let lastName = document.getElementById('iLastName').val();
        let age = document.getElementById('iAge').val();
        let dateOfBirth = document.getElementById('iDateOfBirth').val();

        let validationErrors = "";

        if (password1 === password2) {
            validationErrors = validationErrors + "Passwords do not match."
        }
        if (!isInt(age)) {
            validationErrors = validationErrors + "<br> Age must be a number."
        }
        if (dateOfBirth !== "" && !isStringDate(dateOfBirth)) {
            validationErrors = validationErrors + "<br> Date of Birth should be in MM\DD\YYYY format";
        }

        //TODO: add other validation logic
        if (validationErrors !== "") {
            e.preventDefault();
            return false;
        } else return true;
    }
    catch (error) {
        console.error("Submission unsuccessful!" + error);
        e.preventDefault();
        return false;
    }
};
