const modronRequests = require('../repositories/modronRequests');


test('delete thing', () => {
    modronRequests.deleteThing("urn:dev:ops:3033-gas-sensor").then(res=>{
        console.log("success")
        console.log(res)
    }
    ).catch(console.error);
});
