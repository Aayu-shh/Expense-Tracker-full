const email = document.querySelector('#email');
const pass = document.querySelector('#pass');
const myForm = document.querySelector('#myform')
const myDiv = document.querySelector('#myDiv');
const backendApi = 'http://44.211.163.102:3000'
myForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const existingUserObj = {
        emailed: email.value,
        passed: pass.value
    }


    axios.post(`${backendApi}/user/login`, (existingUserObj))
        .then(resObj => {
            console.log(resObj.data);
            if (resObj.data.success) {
                localStorage.setItem('token', `${resObj.data.token}`);
                localStorage.setItem('isPremium', `${resObj.data.premium}`);
                location.href = resObj.data.redirect;
                alert('User logged in Successfully');
            }
        })
        .catch(err => {
            myDiv.innerHTML = " ";
            console.log(err);
            if (err.response.status == 401) {
                myDiv.append(document.createTextNode(err.response.data));
                myDiv.classList.add("redText");
            }
            else {
                myDiv.append(document.createTextNode(err.response.data));
                myDiv.classList.add("yellowText");
            }
        });
});
