import React from 'react'
import { Spinner } from 'react-bootstrap'

function Loader() {
  return (
    <div  className="spinner"> <Spinner className="m-1 p-2"animation="grow" variant="success" />
    <Spinner className="m-1 p-2"animation="grow" variant="danger" />
    <Spinner className="m-1 p-2" animation="grow" variant="warning" />
    <Spinner className="m-1 p-3" animation="grow" variant="info" /></div>
  )
}

export default Loader