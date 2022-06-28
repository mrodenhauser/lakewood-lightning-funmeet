String.prototype.padLeft = function (length, character) {
    return new Array(length - this.length + 1).join(character || ' ') + this;
};

Date.prototype.toFormattedString = function () {
    return [String(this.getMonth()+1).padLeft(2, '0'),
        String(this.getDate()).padLeft(2, '0'),
        String(this.getFullYear())].join("/")
};

exports.isInt = function (value) {
    let x;
    if (isNaN(value)) {
        return false;
    }
    x = parseFloat(value);
    return (x | 0) === x;
};

//duck type validation...not bulletproof, however a type that matches all these is
// likely intentionally thwarting such logic...and deserves the consequences :)
exports.isDate = function (value){
    if (value && typeof value.getMonth === 'function'
        && typeof value.getFullYear === 'function'
        && typeof value.getDay === 'function'
        && typeof value.getHours === 'function'
        && typeof value.getDate === 'function'){
        return true;
    }
    else {
        return false;
    }
};

exports.isBoolean = function (value){
    return (typeof value === "boolean")
};

exports.isStringDate = function (value) {
    let tryParse = Date.parse(value);
    if (tryParse) {
        return(this.isDate(new Date(tryParse)));
    }
    else return false;
};

exports.getOptStrElement = function (json, elementName) {
    if(json && json[elementName])
    {
        return json[elementName];
    }
    else return null;
};

exports.getOptIntElement = function (json, elementName) {
    if(json && json.hasOwnProperty(elementName))
    {
        return parseInt(json[elementName]);
    }
    else return null;
};

exports.StringifyDataObj = function (obj) {
    if(obj && this.isDate(obj)){
        return obj.toFormattedString();
    }
    else {
        if(obj) {
            return obj.toString().trim();
        }
        else{
            return obj; //if it was null to begin with, just keep it null
        }
    }
};