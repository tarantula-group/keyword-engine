function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
};


exports.getPastXDays = function getPastXDays (days) {
    var today = new Date();
    var lastDataAvailable = formatDate(today.setDate(today.getDate() - 2));
    var firstDataAvailable = formatDate(today.setDate(today.getDate() - (days + 2)));

    return {
        startDate: firstDataAvailable,
        endDate: lastDataAvailable
    }
};

exports.formatDate = formatDate;
