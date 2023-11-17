import React, { useState, useEffect } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom';
import { login } from '../redux/actions/authAction'
import { useDispatch, useSelector } from 'react-redux'
// import Logo from '../components/logo'



const Login = () => {

    const initialState = { email: '', password: '' }
    const [userData, setUserData] = useState(initialState)
    const { email, password } = userData

    const [typePass, setTypePass] = useState(false)

    const { auth } = useSelector(state => state)
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        if(auth.token) history.push("/")
    }, [auth.token, history])

    const handleChangeInput = e => {
        const { name, value } = e.target
        setUserData({...userData, [name]:value})
    }

    const handleSubmit = e => {
        e.preventDefault()
        dispatch(login(userData))
    }

    const getRandomPosition = () => {

        const regionWidth = window.innerWidth - 300; 
        const regionHeight = window.innerHeight - 300; 

        const randomX = Math.floor(Math.random() * regionWidth);
        const randomY = Math.floor(Math.random() * regionHeight);

        return { top: randomY, left: randomX };
    };

    const getRandomColor = () => {

        const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)}, 0.1)`;
        return randomColor;
    };

    const [squares, setSquares] = useState([]);

    useEffect(() => {
        const squaresData = Array.from({ length: 7 }).map((_, index) => ({
            id: index,
            position: getRandomPosition(),
            color: getRandomColor(),
        }));
        setSquares(squaresData);
    }, []);

    const location = useLocation();
    const isLoginPage = location.pathname === '/';
    const isRegisterPage = location.pathname === '/register';

    return (

        <div className={`auth_page ${isLoginPage || isRegisterPage ? 'login_register_background' : ''}`}>


                {squares.map((square) => (
                    <div
                    key={square.id}
                    className="glassSquare"
                    style={{
                        top: square.position.top,
                        left: square.position.left,
                        background: square.color,
                    }}
                    ></div>
                ))}

            <form onSubmit={handleSubmit} className='log-reg-from'>

                {/* <Logo /> */}
                <div style={{textAlign:"center"}}>
                    <h2>
                        <span className='custom-span' style={{fontWeight:"600",fontSize:"1.35rem"}}>C</span>
                        <span className='header-text'>Connectify</span>
                    </h2>
                </div>

                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" name="email"
                    aria-describedby="emailHelp" onChange={handleChangeInput} value={email} />
                    
                    <small id="emailHelp" className="form-text text-muted">
                        We'll never share your email with anyone else.
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>

                    <div className="pass">
                        
                        <input type={ typePass ? "text" : "password" } 
                        className="form-control" id="exampleInputPassword1"
                        onChange={handleChangeInput} value={password} name="password" />

                        <small onClick={() => setTypePass(!typePass)}>
                            {typePass ? 'Hide' : 'Show'}
                        </small>
                    </div>
                </div>
                
                <button type="submit" className="btn  w-100 login-btn" 
                disabled={email && password ? false : true}>
                    Login
                </button>

                <p className="my-2">
                    You don't have an account? <Link to="/register" style={{color: "crimson"}}>Register Now</Link>
                </p>
            </form>
        </div>
    )
}

export default Login
