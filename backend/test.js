const backend = require('./backend');

let options = [{}];
let budget = ;
let {error, result} = backend.basicComputeBestOption(options, budget);
if (error) {
    console.log(error);
} else {
    if (condition) {
        console.log("passed " + result);
    } else {
        console.log("failed " + result);
    }
}