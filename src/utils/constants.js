let apiRoot =''

console.log(import.meta.env)
console.log(process.env)

if(process.env.BUILD_MODE === 'dev') {
    apiRoot = 'http://localhost:8017'
}
if(process.env.BUILD_MODE === 'production') {
    apiRoot = 'https://trello-api-8nf5.onrender.com'
}

export const API_ROOT = apiRoot