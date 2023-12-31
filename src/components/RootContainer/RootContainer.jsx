import React from 'react';
import SideBar from '../SideBar/SideBar'
import { css } from '@emotion/react';
/** @jsxImportSource @emotion/react */;

const rootContainer = css`
    display: flex;
    width: 100%;
    height: 100%;
`

const mainContainer = css`
    flex-grow: 1;
    height: 100%;
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    padding: 20px 20px 20px;
`

function RootContainer({ children }) {
    return (
        <div css={rootContainer}>
            <SideBar />
            <div css={mainContainer}>
                {children}
            </div>
        </div>
    );
}

export default RootContainer;