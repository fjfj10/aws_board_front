import React, { useEffect, useRef, useState } from 'react';
import RootContainer from '../../components/RootContainer/RootContainer';
import { useQueryClient } from 'react-query';
import { instance } from '../../api/config/instance';
import { css } from '@emotion/react';
/** @jsxImportSource @emotion/react */
import { ref, getDownloadURL, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { storage } from '../../api/firebase/firebase';
import { Line } from 'rc-progress';

const infoHeader = css`
    display: flex;
    align-items: center;
    margin: 10px;
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    padding: 20px;
    width: 100%;
`

const imgBox = css`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    border: 1px solid #dbdbdb;
    border-radius: 50%;
    width: 100px;
    height: 100px;
    overflow: hidden;
    cursor: pointer;

    & > img {
        width: 100%;
    }
`

const file = css`
    display: none;
`

function Mypage(props) {
    const qureyClient = useQueryClient();
    const principalState = qureyClient.getQueryState("getPrincipal");
    const principal = principalState?.data?.data;
    const profileFileRef = useRef();
    const [ uploadfiles, setUploadfiles ] = useState([]);
    const [ profileImgSrc, setProfileImgSrc ] = useState("");
    const [ progressPercent, setProgressPercent ] = useState(0);

    useEffect(() => {
        setProfileImgSrc("");
    }, []);

    const handleProfileUploadClick = () => {
        if (window.confirm("프로필 사진을 변경하시겠습니까?")) {
            profileFileRef.current.click();
        }
    }

    const handleProfileChange = (e) => {
        const files = e.target.files;

        if(!files.length) {
            setUploadfiles([]);
            e.target.value = "";
            return;
        }

        for(let file of files) {
            setUploadfiles([...uploadfiles, file]);
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setProfileImgSrc(e.target.result);
        }

        reader.readAsDataURL(files[0]);
    }

    const handleUploadSubmit = () => {
        console.log(uploadfiles[0].name);
        const storageRef = ref(storage, `files/profile/${uploadfiles[0].name}`);
        const uploadTask = uploadBytesResumable(storageRef, uploadfiles[0]);    // 파일 업로드 코드

        // uploadTask.on: 파일업로드가 시작되면 snapshot: %가 들어있음(현재상태), error가 났을때, 성공했을때 방금 올린 경로를 받아온다 => 경로를 저장해두면 이미지를 불러오는것이 가능해진다 
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                setProgressPercent(
                    Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                );
            },
            (error) => {
                console.log(error)
            },
            () => {
                getDownloadURL(storageRef).then(downloadUrl => {
                    console.log(downloadUrl);
                    setProfileImgSrc(downloadUrl);
                    alert("프로필 사진이 변경되었습니다.");
                    window.location.reload();
                })
            }
        )
    }

    const handleUploadCancel = () => {
        setUploadfiles([]);
        profileFileRef.current.value = "";
    }

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
                <div css={infoHeader}>
                    <div>
                        <div css={imgBox} onClick={handleProfileUploadClick}>
                            <img src={profileImgSrc} alt="" />
                        </div>
                        <input css={file} type="file" onChange={handleProfileChange} ref={profileFileRef} />
                        {!!uploadfiles.length && 
                            <div>
                                <Line percent={progressPercent} strokeWidth={4} strokeColor="#dbdbdb" />
                                <button onClick={handleUploadSubmit}>변경</button>
                                <button onClick={handleUploadCancel}>취소</button>
                            </div>
                        }
                    </div>
                    <div>
                        누적 포인트: 0원
                    </div>
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