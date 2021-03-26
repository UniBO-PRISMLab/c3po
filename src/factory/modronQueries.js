const login = () => {
  return {
    query:
      `mutation {
                login(data : {usernameOrEmail: "${process.env.MODRON_USER}", password: "${process.env.MODRON_PASSWORD}"}) {
                  token
                }
              }`
  };
}

const registerThing = (url) => {
  return {
    query: `
    mutation {
        createThing(data : {tdURL:"`+ url + `", private: false}) {
            id,
            title
        }
    }`
  }
}
const getAll = () => {
  return {
    query: `query{
      viewer{
        id
        things{
          id
          td
          title
          description
          type
          lat
          lng
          tdURL
          private
          owner{
            id 
            username
          }
          tags {
            id
            name
          }
          createdAt
          updatedAt
        }
      }
    }`
  }
}

module.exports = {
  login,
  getAll,
  registerThing
};