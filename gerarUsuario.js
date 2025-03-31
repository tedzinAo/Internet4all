const n1 = Math.floor(Math.random() * 100)
const n2 = Math.floor(Math.random() * 1000)
const n3 = Math.floor(Math.random() * 10)
const user = document.querySelector('.user')

console.log(n1);

const users = ()=>{
     
    return 'user-'+ String(n1) + String(n2) + n3
}


user.innerHTML = users()
console.log(users());
