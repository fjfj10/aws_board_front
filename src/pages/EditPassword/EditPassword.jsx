import React, { useState } from 'react';
import { css } from '@emotion/react';
/** @jsxImportSource @emotion/react */
import RootContainer from '../../components/RootContainer/RootContainer';
import { instance } from '../../api/config/instance';

function EditPassword(props) {
    const[ passwordObj, setPasswordObj ] = useState({
        oldPassword: "",
        newPassword: "",
        checkNewPassword: ""
    });

    const handleInputChange = (e) => {
        setPasswordObj({
            ...passwordObj,
            [e.target.name]: e.target.value
        });
    }

    const handlePasswordUpdateSubmit = async () => {
        try {
            const option = {
                headers: {
                    Authorization: localStorage.getItem("accessToken")
                }
            }
            await instance.put("/account/password", passwordObj, option);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <RootContainer>
            <div>
                <div><input type="password" name='oldPassword' 
                    onChange={handleInputChange} placeholder='이전 비밀번호' /></div>
                <div><input type="password" name='newPassword' 
                    onChange={handleInputChange} placeholder='새 비밀번호' /></div>
                <div><input type="password" name='checkNewPassword' 
                    onChange={handleInputChange} placeholder='새 비밀번호 확인' /></div>

                <button onClick={handlePasswordUpdateSubmit}>변경하기</button>
            </div>
        </RootContainer>
    );
}

export default EditPassword;