import { useState } from "react"
import axios from "axios"
import { Link, Navigate, useNavigate, useOutletContext } from "react-router-dom"

const Login = () => {
    const [channelName, setChannelName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [description, setDescription] = useState("")
    const [isLoading, setLoading] = useState(false)
    const navigate = useNavigate()

    const api_base_url = import.meta.env.VITE_API_URL
    const { setLoginState } = useOutletContext()


    const submitHandler = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)

            const data = {
                email,
                channelName,
                password,
                description
            }
            console.log(data);

            const res = await axios.post(`${api_base_url}/user/login`, data)
            console.log(res.data)
            const token = res.data.token;

            // console.log("TOKEN FROM LOGIN:", token);

            localStorage.setItem("token", token);
            localStorage.setItem('channelName', res.data.data.channelName)
            localStorage.setItem('userId', res.data.data._id)
            // localStorage.setItem('isLogin',true)
            setLoginState(true)
            setLoading(false)
            navigate('/')



        }
        catch (err) {
            console.log(err);
            setLoading(false)
            swal({
                text: "Something is wrong!",
                icon: "error",
                button: "Ok",
            });

        }

    }
    return (
        <div className="form-wrapper">
            <form onSubmit={submitHandler} className="form">
                <h2>Login</h2>

                <input className="form-input" placeholder="email" name="email" value={email} type="text" onChange={(e) => { setEmail(e.target.value) }} />
                <input className="form-input" placeholder="password" name="password" value={password} type="password" onChange={(e) => { setPassword(e.target.value) }} />


                <button className="submit-btn" type="submit" >{isLoading && <span> <i className="fa-solid fa-spinner fa-spin-pulse"></i></span>} Login </button>



                <div className="link-wrapper">Dont't have an account? <Link to='/signup'>Sign up</Link></div>
            </form>
        </div>
    )
}
export default Login