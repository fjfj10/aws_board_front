import React from 'react';
import RootContainer from '../../components/RootContainer/RootContainer';
import { useQueryClient } from 'react-query';
import { instance } from '../../api/config/instance';

function Mypage(props) {
    const qureyClient = useQueryClient();
    const principalState = qureyClient.getQueryState("getPrincipal");
    const principal = principalState?.data?.data;

    const handleSendMail = async() => {
        const option = {
            headers: {
                Authorization: localStorage.getItem("accessToken")
            }
        }
        try {
            // post(요청url, 보낼 객체, option) -> 보내는게 없어도 {}로 자리를 채워준다 아님 오류남
            await instance.post("account/mail/auth", {}, option);
            alert("인증메일 전송완료. 인증 요청 메일을 확인해주세요");
        } catch (error) {
            alert("인증메일 전송 실패. 다시 시도해주세요.");
        }
    }

    return (
        <RootContainer>
            <div>
                <div>
                    <img src="" alt="이미지" />
                </div>
                <div>
                    누적 포인트: 0원
                </div>
                <div>
                    <div>닉네임: {principal.nickname}</div>
                    <div>이름: {principal.name}</div>
                    <div>
                        이메일: {principal.email} {principal.enabled ? <button disabled={true}>인증완료</button> : <button onClick={handleSendMail}>인증하기</button>}
                    </div>
                </div>
            </div>
        </RootContainer>
    );
}

export default Mypage;