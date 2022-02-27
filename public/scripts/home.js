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
        let validationErrors = "";

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
