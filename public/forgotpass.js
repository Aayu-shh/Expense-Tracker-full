
document.addEventListener('submit', async (e) => {
    console.log();
    const backendApi = 'http://localhost:2000';

    try {
        e.preventDefault();
        const fgresp = await axios.post(`${backendApi}/password/forgotpassword`, { email: document.querySelector('#email').value });
        if(fgresp.data.success==true) alert('Check you email for Password Reset link');
    }
    catch (err) {
        console.log(err);
    }
})
