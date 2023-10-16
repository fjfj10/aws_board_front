import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup(props) {
    const navigate = useNavigate();
    
    const user = {
        email: "",
        password: "",
        name: "",
        nickname: ""
    }
    const [ signupUser, setSignupUser ] = useState(user);

    const handleInputChange = (e) => {
        setSignupUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const handleSigninClick = () => {
        navigate("/auth/signin");
    }

    return (
        <div>
            <div><input type="email" name='email' placeholder='이메일' onChange={handleInputChange}/></div>
            <div><input type="password" name='password' placeholder='비밀번호' onChange={handleInputChange}/></div>
            <div><input type="text" name='name' placeholder='이름' onChange={handleInputChange}/></div>
            <div><input type="text" name='nickname' placeholder='닉네임' onChange={handleInputChange}/></div>
            <div><button>가입하기</button></div>
            <div><button onClick={handleSigninClick}>로그인</button></div>
        </div>
    );
}

export default Signup;