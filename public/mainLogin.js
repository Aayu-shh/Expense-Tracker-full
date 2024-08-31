const email = document.querySelector('#email');
const pass = document.querySelector('#pass');
const myForm = document.querySelector('#myform')
const myDiv = document.querySelector('#myDiv');
const backendApi = 'http://52.73.239.207';
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
            myDiv.innerHTML = "";  // Clear previous messages
            myDiv.classList.remove("hidden", "redText", "yellowText");  // Reset classes

            if (err.response.status == 401) {
                myDiv.textContent = err.response.data;  // Set Unauthorized error message
                myDiv.classList.add("redText");
            } else {
                myDiv.textContent = err.response.data;  // Set User Not Found message
                myDiv.classList.add("yellowText");
            }

            myDiv.style.display = 'block';
        });
})