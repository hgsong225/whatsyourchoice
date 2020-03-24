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
            <Row>
                <Col>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="당신의 생각을 들려주세요."
                            aria-describedby="basic-addon2"
                            name={comment.id}
                            ref={register}
                        />
                        <InputGroup.Append>
                        <Button variant="outline-secondary"
                            onClick={handleSubmit(addReComment)}
                        >
                            완료
                        </Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Col>
                <Col>
                    {
                        comment.recomments.map(recomment => (
                            <Row className="margin-unstyled recomment align-items-center">
                                <Col sm={2} className="sm-row-start col-centering">
                                        <Image src="../../../default-profile2.png/" roundedCircle />
                                        <span>익명</span>
                                </Col>
                                <Col sm={8}>
                                    <div className="col-start">
                                        <p>
                                            {recomment.text}
                                        </p>
                                        <div className="row-start">
                                            <span>좋아요</span>
                                            <span>{recomment.like.length}</span>
                                            <span>싫어요</span>
                                            <span>{recomment.dislike.length}</span>
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={2}>
                                    <span>{recomment.created.seconds}</span>
                                </Col>
                            </Row>
                        ))
                    }
                
                </Col>
            </Row>
    );
};