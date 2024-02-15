import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        let token = localStorage.getItem('token')
        if (token) {
            navigate('/delivery')
        }
        let tokenStatus = localStorage.getItem('tokenStatus')
        if (tokenStatus) {
            setError(tokenStatus)
            localStorage.removeItem('tokenStatus')
        }

        setTimeout(() =>{setError("")}, 10000) // clear error message after 10 seconds
        setTimeout(() =>{setMessage("")}, 5000) // clear message after 5 seconds
    }, [error, message])

    const handleInputChange = (e : any, type : string) => {
        switch (type) {
            case 'email':
                setError('')
                setEmail(e.target.value)
                if (e.target.value === '') setError('Please enter your email address')
                break

            case 'password':
                setError('')
                setPassword(e.target.value)
                if (e.target.value === '') setError('Please enter your password')
                break

            default: return null;
        }
    }

    const handleLogin = async () => {
        try {
            if (email !== "" && password !== "") {
                const response = await axios.post(`${import.meta.env.VITE_REACT_BASE_URL}/login.php`,
                    { action: 'login', email, password },
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        }
                    }
                );                
            
                if (response.data.status === 200) {
                    localStorage.setItem("token", response.data.token);
                    setMessage('Login successfully! Redirecting...');
                    setTimeout(() =>{
                        navigate('/delivery')
                    }, 5000)
                } else {
                    console.error('Login failed: Invalid email or password');
                    setError('Invalid email or password!')
                }
            }
        } catch (error) {
            console.error('An error occurred during login:', error);
        }
    }

    return (
        <>
        <div className='container'>
        <div className="row">
            <div className="col-sm"></div>
            <div className="col-sm text-center">
                <div className='pb-5 pt-3'><img src="../TRU_logo.png" alt="Toys R Us" /></div>
                            
                {
                    error !== "" && <p className='pb-1'><span className='alert alert-danger'>{error}</span></p>
                }
                {
                    message !== "" && <p className='pb-1'><span className='alert alert-success'>{message}</span></p>
                }
                
                <h5 className='pb-2'>Login to your account</h5>

                <div className="input-container">
                    <input type="email" id="email" name="email" value={email}
                        onChange={(e) => handleInputChange(e, "email")} required />
                    <label htmlFor="email">Email *</label>
                </div>

                <div className="input-container">
                    <input type="password" id="password" name="password" value={password}
                        onChange={(e) => handleInputChange(e, "password")} required />
                    <label htmlFor="password">Password *</label>
                </div>

                <button type="button" className="btn btn-fullwidth bg-link-blue" onClick={() => navigate('/forget')}>
                    Forget Password?
                </button>
                <button type="button" className="btn btn-fullwidth bg-blue" onClick={handleLogin}>
                    Login
                </button>

                <div className="separator">
                    <hr className="separator-left" />
                    <span>OR</span>
                    <hr className="separator-right" />
                </div>

                <button type="button" className="btn btn-fullwidth bg-red" onClick={() => navigate('/signup')}>
                    Create an account
                </button>
            </div>
            <div className="col-sm"></div>
        </div>
        </div>
        </>
    )
}

export default Login