// module.exports = GetDate

exports.GetDate =  // when exporting more than one functions

 function () {
const today = new Date();

const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
};

let day = today.toLocaleDateString("en-US",options);
return day;
}

exports.GetDay  = function (){
    const today = new Date();

const options = {
    weekday: 'long'
};

let day = today.toLocaleDateString("en-US",options);
return day;
    
}