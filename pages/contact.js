import Head from 'next/head'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import NavigationBar from '../components/NavigationBar'

import '../static/root.css'

const contact = (props) => (
    <div>
        <NavigationBar />
        <div className="container">
            <Container fluid>
                <Row>
                    <Col>
                        whatsyourchoice@gmail.com
                    </Col>
                </Row>
            </Container>
        </div>
    </div>
);

export default contact;
