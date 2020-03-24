import Head from 'next/head'
import Link from 'next/link'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'

/* Configures */
import firebase from '../config/firebase'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../static/root.css'

export default function NavigationBar (props) {
    return (
        <div>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <meta 
                    name='viewport'
                    content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' 
                />
                <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic&family=Noto+Sans+KR&display=swap" rel="stylesheet"></link>
            </Head>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Link href='/'>
                    <Navbar.Brand style={{ cursor: "pointer" }}>너의선택은 beta</Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                    </Nav>
                    <Nav>
                        <Link href='/contact' passHref>
                            <Nav.Link>문의하기</Nav.Link>
                        </Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};