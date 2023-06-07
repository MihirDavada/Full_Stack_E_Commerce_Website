import React from 'react'
import {Alert} from 'react-bootstrap'
const Error = (props) => {
  return (
      <Alert className='centre' variant={props.variant}>
        {props.children}
      </Alert>
  )
}

export default Error