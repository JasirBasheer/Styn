import styled from 'styled-components';

export const StyledForm = styled.form`
    max-width: 350px;
    width: 100%;
    margin: 2rem auto;

    h2{
        margin-top: 6rem;
        margin-bottom: 2rem;
    }

    button, input{
        height: 35px;
        width: 100%;
        padding: 7px;
        outline: none;
        border-radius: 5px;
        border: 1px solid rgb(220, 220, 220);
        margin-bottom: 1rem;

        &:focus{
            border: 1px solid rgb(31, 36, 37);
        }
    }

    p{
        font-size: 14px;
        color: red;
        margin-bottom: 9rem;

    }
    button{
        cursor: pointer;

        &:focus{
            border: none;
        }
    }
`