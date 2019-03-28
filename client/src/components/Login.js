import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'

export default () => {
    return (
        <Container fluid>
            {/* <Row>
                <Col style={{backgroundColor:'gray'}}>1 of 2</Col>
                <Col style={{backgroundColor:'lightGray'}}>2 of 2</Col>
            </Row>
            <Row>
                <Col style={{backgroundColor:'blue'}}>1 of 3</Col>
                <Col style={{backgroundColor:'green'}}>2 of 3</Col>
                <Col style={{backgroundColor:'red'}}>3 of 3</Col>
            </Row> */}

            <Link to="/home">Enter</Link>
        </Container>
    )
}