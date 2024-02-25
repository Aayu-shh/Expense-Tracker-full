const name = document.querySelector('#name');
const email = document.querySelector('#email');
const pass = document.querySelector('#pass');
const myForm = document.querySelector('#myform')
const backendApi = 'http://localhost:2000'

myForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newUserObj = {
        named: name.value,
        emailed: email.value,
        passed: pass.value
    }
    console.log(newUserObj);

    try {
        const resObj = await axios.post(`${backendApi}/user/signup`, (newUserObj))

        if (resObj.data.name != 'SequelizeUniqueConstraintError')
        {
            window.alert('Your signup was Success');
            window.location.href = 'login.html';            //navigate to Login Page if successful signup
        }
        else{
            console.log(resObj);
            window.alert('User already there in DB!! Try logging in, OR Forgot Password options');
        }
    }
    catch (err) {
        console.log(err);
    }
});
