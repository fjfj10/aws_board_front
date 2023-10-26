import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import RootContainer from '../../components/RootContainer/RootContainer';
import { css } from '@emotion/react';
import ReactSelect from 'react-select';
import { useEffect } from 'react';
import { useState } from 'react';
import { instance } from '../../api/config/instance';
import { useQuery } from 'react-query';
/** @jsxImportSource @emotion/react */

const table = css`
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #dbdbdb;

    & th, td {
        border: 1px solid #dbdbdb;
        height: 30px;
        text-align: center;
    }

    & td {
        cursor: pointer;
    }
`;

const searchContainer = css`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    width: 100%;
    
    & > * {
        margin-left: 5px;
    }
`;

const selectBox = css`
    width: 100px;
`;

const SPageNumbers = css`
    display: flex;
    align-items: center;
    margin-top: 10px;
    width: 200px;

    & button {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0px 3px;
        width: 20px;
        border: 1px solid #dbdbdb;
        cursor: pointer;
    }

`;

const SBoardTitle = css`
    max-width: 500px;
    width: 500px;
    overflow: hidden;
    /* ellipsis: text가 길이를 벗어나면 자동으로 생략(...)*/
    text-overflow: ellipsis;
    /* ellipsis: text가 길이를 벗어날때 자동 줄바꿈 방지*/
    white-space: nowrap;
    
`

function BoardList(props) {
    const navigate = useNavigate();
    const { category, page } = useParams();

    const options = [
        {value: "전체", label: "전체"},
        {value: "제목", label: "제목"},
        {value: "작성자", label: "작성자"}
    ];

    const search = {
        optionName: options[0].label,
        searchValue: ""
    }

    const [ searchParams, setSearchParams ] = useState(search);

    const getBoardList = useQuery(["getBoardList", page, category], async () => {
        const option = {
            params: searchParams
        }
        return await instance.get(`/boards/${category}/${page}`, option);
    }, {
        refetchOnWindowFocus: false
    });

    const getBoardCount = useQuery(["getBoardList", category], async () => {
        const option = {
            params: searchParams
        }
        return await instance.get(`/boards/${category}/count`, option);
    }, {
        refetchOnWindowFocus: false
    });

    const handleSearchInputChange = (e) => {
        setSearchParams({
            ...searchParams,
            searchValue: e.target.value
        })
    }

    const handleSearchOptionSelect = (option) => {
        setSearchParams({
            ...searchParams,
            optionName: option.label
        })
    }

    const handleSearchButtonClick = () => {
        navigate(`/board/${category}/1`);
        getBoardList.refetch();
        getBoardCount.refetch();
    }

    // 페이지 버튼 설정
    const pagenation = () => {
        if(getBoardCount.isLoading) {
            return <></>
        }
        const totalBoardCount = getBoardCount.data.data
        const lastPage = totalBoardCount % 10 === 0 
            ? totalBoardCount / 10
            // Math.floor(): 절삭 = 나머지 버림
            : Math.floor(totalBoardCount / 10) + 1

        // page - (page % 5) + 1은 5, 10, 15 같은 나머지가 없을때는 startIndex가 page+1이 되므로 page % 5 === 0인경우 page - 4 해준다
        const startIndex = parseInt(page) % 5 === 0 ? parseInt(page) - 4 : parseInt(page) - (parseInt(page) % 5) + 1;
        const endIndex = startIndex + 4 <= lastPage ? startIndex + 4 : lastPage

        const pageNumbers = [];

        for (let i = startIndex; i <= endIndex; i++) {
            pageNumbers.push(i);
        }
        

        return (
            <>
                <button disabled={parseInt(page) === 1} onClick={() => {
                    navigate(`/board/${category}/${parseInt(page) - 1}`);
                }}>&#60;</button>

                {pageNumbers.map(num => {
                    return <button key={num} onClick={() => {
                        navigate(`/board/${category}/${num}`)
                    }}>{num}</button>
                })}

                <button disabled={parseInt(page) === lastPage} onClick={() => {
                    navigate(`/board/${category}/${parseInt(page) + 1}`);
                }}>&#62;</button>
            </>

        )
    }

    return (
        <RootContainer>
            <div>
                <h1>{category === "all" ? "전체 게시글" : category}</h1>
                
                <div css={searchContainer}>
                    <div css={selectBox}>
                        <ReactSelect options={options} defaultValue={options[0]} 
                        onChange={handleSearchOptionSelect} />
                    </div>
                    <input type="text" onChange={handleSearchInputChange} />
                    <button onClick={handleSearchButtonClick}>검색</button>
                </div>
                <table css={table}>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>작성일</th>
                            <th>조회수</th>
                            <th>추천</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!getBoardList.isLoading && getBoardList?.data?.data.map(board => {
                            return <tr key={board.boardId} onClick={() => {navigate(`/board/${board.boardId}`)}}>
                                        <td>{board.boardId}</td>
                                        <td css={SBoardTitle}>{board.title}</td>
                                        <td>{board.nickname}</td>
                                        <td>{board.createDate}</td>
                                        <td>{board.hitsCount}</td>
                                        <td>{board.likeCount}</td>
                                    </tr>
                        })}
                    </tbody>
                </table>

                <div css={SPageNumbers}>
                    {pagenation()}
                </div>
            </div>
        </RootContainer>
    );
}

export default BoardList;