const form =
document.getElementById('loginForm');

// HARDCODED ADMIN CREDENTIALS: admin / admin123
// (Bypasses database check automatically)

form.addEventListener(
'submit',

async function(e){

    e.preventDefault();

    const username =
    document.getElementById(
    'username'
    ).value.trim();

    const password =
    document.getElementById(
    'password'
    ).value.trim();

    // Validation
    if(!username || !password){
        alert('Please enter username and password');
        return;
    }

    try{
        let response = await fetch(

        '/api/login',

        {

            method:'POST',

            headers:{
                'Content-Type':'application/json'
            },

            body:JSON.stringify({

                username,
                password

            })

        });

        console.log('Login request:', '/api/login', response.status);

        if(response.status === 404){
            response = await fetch(

            '/api/auth/login',

            {

                method:'POST',

                headers:{
                    'Content-Type':'application/json'
                },

                body:JSON.stringify({

                    username,
                    password

                })

            });

            console.log('Login fallback request:', '/api/auth/login', response.status);
        }

        const contentType =
        response.headers.get('content-type') || '';

        const data =
        contentType.includes('application/json')
        ? await response.json()
        : {
            message:`Server returned ${response.status}. API route is not configured correctly.`
        };

        if(!response.ok){
            alert(data.message || 'Login failed');
            return;
        }

        if(data.token){

            // SAVE TOKEN
            localStorage.setItem(
                'token',
                data.token
            );

            localStorage.setItem(
                'role',
                data.role
            );

            localStorage.setItem(
                'username',
                data.username
            );

            window.location.href =
            '/';

        }else{

            alert(data.message || 'Login failed');

        }
    }catch(error){
        alert('Connection error: ' + error.message);
    }

});
