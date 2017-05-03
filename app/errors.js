exports.httpError = function(customMessage, originalError) {
    var err = new Error(customMessage);
    err.originalError = originalError;
    return err;
};

let keywordSaveError = function (customMessage, originalError) {
    this.name = `Kewyord couldn't be save`;
    this.message = customMessage;
    this.originalError = originalError;
};

keywordSaveError.prototype = Error.prototype;

exports.keywordSaveError = keywordSaveError;