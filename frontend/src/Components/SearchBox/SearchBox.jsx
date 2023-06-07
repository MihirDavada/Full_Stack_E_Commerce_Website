import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useLocation, useNavigate} from 'react-router-dom'

function SearchBox() {
    const [keyword, setKeyword] = useState('')
    const navigate = useNavigate()
    const location = useLocation()

    // console.log(location.pathname)

    const submitHandler = (e) => {
        e.preventDefault()
        if (keyword) {
            navigate(`/?keyword=${keyword}`)
        } 
        else{
            navigate(location.pathname)
        }
        setKeyword('')
    }
    return (
        <Form onSubmit={submitHandler} style={{display:'flex'}}>
            <Form.Control
                type='text'
                name='q'
                onChange={(e) => setKeyword(e.target.value)}
                style={{marginRight : '5px'}}
            ></Form.Control>

            <Button
                type='submit'
                variant='outline-success'
                className='p-2'
            >
                Submit
            </Button>
        </Form>
    )
}

export default SearchBox
