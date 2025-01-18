const name = document.querySelector('#name');
const email = document.querySelector('#email');
const pass = document.querySelector('#pass');
const myForm = document.querySelector('#myform');
const myDiv = document.getElementById('myDiv'); // Reference to error message div
const backendApi = 'http://52.73.239.207';

myForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newUserObj = {
        named: name.value,
        emailed: email.value,
        passed: pass.value
    }
    console.log(newUserObj);

    try {
        const resObj = await axios.post(`${backendApi}/user/signup`, newUserObj);

        if (resObj.data.name !== 'SequelizeUniqueConstraintError') {
            window.alert('Your signup was successful!');
            window.location.href = 'login.html'; // Navigate to Login Page if successful signup
        } else {
            console.log(resObj);
            myDiv.textContent = 'User already exists! Try LogIn OR ForgotPassword';
            myDiv.classList.remove("hidden", "yellowText");
            myDiv.classList.add("redText");
            myDiv.style.display = 'block';
            setTimeout(() => {
                myDiv.innerHTML = '';
                myDiv.classList.add('hidden')
            }, 5000);
        }
    } catch (err) {
        console.log(err);
        myDiv.innerHTML = ''; // Clear previous messages
        myDiv.classList.remove("hidden", "redText", "yellowText"); // Reset classes

        if (err.response && err.response.status === 400) {
            myDiv.textContent = 'Invalid input! Please Try again.';
            myDiv.classList.add("redText");
            setTimeout(() => {
                myDiv.innerHTML = '';
                myDiv.classList.add('hidden')
            }, 5000);
        } else {
            myDiv.textContent = 'Something went wrong. Please try again later.';
            myDiv.classList.add("yellowText");
            setTimeout(() => {
                myDiv.innerHTML = '';
                myDiv.classList.add('hidden')
            }, 5000);
        }

        myDiv.style.display = 'block';
    }
});