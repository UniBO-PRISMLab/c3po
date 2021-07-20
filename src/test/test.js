const descriptor = require('./converted_td.json');
const wotCreator = require('../wotCreator')


const thing = wotCreator.createThing(descriptor).then(() => {
    console.log("thing created")
}).catch((err) => {
    console.error(err)
});;

console.info(thing);
