import React from 'react';
import { css } from '@emotion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
/** @jsxImportSource @emotion/react */;

const layout = css`
    margin-right: 10px;
    width: 320px;
`

const container = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    padding: 20px;
`

function SideBar(props) {
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const principalState = queryClient.getQueryState("getPrincipal");


    const handleSigninClick = () => {
        navigate("/auth/signin");
    }

    const handleLogoutClick = () => {
        localStorage.removeItem("accessToken");
        // navigate: 상태가 유지됌 -> 상태가 바뀌지 않음 token이 없어져도 로그인 상태 유지, window.location.replace -> 전부 재랜더링=> 상태바뀜
        window.location.replace("/");
    }

    return (
        <div css={layout}>
            {!!principalState?.data?.data ? (
                <div css={container}>
                    <h3>{principalState.data.data.nickname}님 환영합니다</h3>
                    <div><button onClick={handleLogoutClick} >로그아웃</button></div>
                    <div>
                        <Link to={"/account/mypage"}>마이페이지</Link>
                    </div>
                </div>
            ) : (
                <div css={container}>
                    <h3>로그인 후 게시판을 이용해보세요</h3>
                    <div><button onClick={handleSigninClick} >로그인</button></div>
                    <div>
                        <Link to={"/auth/forgot/password"}>비밀번호찾기</Link>
                        <Link to={"/auth/signup"}>회원가입</Link>
                    </div>
                </div>
            )}
            <div>
                <ul>
                    <Link to={"/board/write"}><li>글쓰기</li></Link>
                </ul>
            </div>
            
        </div>
    );
}

export default SideBar;