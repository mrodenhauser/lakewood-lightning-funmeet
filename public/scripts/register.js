const validationsScript = document.createElement('script2');
validationsScript.src = '/scripts/validation.js';
validationsScript.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(validationsScript);

function submitRegistration() {
    let password1 = document.getElementById('iPassword1').value;
    let password2 = document.getElementById('iPassword2').value;
    let age = document.getElementById('iAge').value;
    //let dateOfBirth = document.getElementById('iDateOfBirth').value;

    let validationErrors = "";

    if (password1 === password2) {
        validationErrors = "Passwords do not match."
    }
    if (!isInt(age)) {
        validationErrors = validationErrors + "<br> Age must be a number."
    }
    //if (dateOfBirth !== "" && !isStringDate(dateOfBirth)) {
    //    validationErrors = validationErrors + "<br> Date of Birth should be in MM\DD\YYYY format";
    //}

    //TODO: add other validation logic
    if (validationErrors !== "") {
        e.preventDefault();
        alert(validationErrors)
        return false;
    } else return true;
};
