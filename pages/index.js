/* Frames, Modules, Libraries */
import React, { useState } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { Container, Row, Col, Modal, Button, Form } from 'react-bootstrap'

/* Hooks */
import { useInput } from '../hooks/useInput'

/* Configures */
import firebase from '../config/firebase'

/* Components */
import NavigationBar from '../components/NavigationBar'
import CompareLink from '../components/CompareLink'
import TestLink from '../components/TestLink'

/* Styles */
import '../static/root.css'
import '../static/home.css'

export default function home (props) {
    const router = useRouter();
    let db = firebase.firestore();

    const uuid = props.user.uuid;
    const isAnonymous = props.user.isAnonymous;

    const { value: target1, bind: bindTarget1, reset: resetTarget1 } = useInput('');
    const { value: target2, bind: bindTarget2, reset: resetTarget2 } = useInput('');
    const [ show, setShow ] = useState(false);

    const posts = props.data.posts;
    console.log()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const addPost = (evt) => {
        evt.preventDefault();

        if (!target1.length && !target1.length) {
            return alert('비교 대상을 입력하세요!');
        }

        const type = evt.target.value;

        let postsData = {
            created: firebase.firestore.Timestamp.fromDate(new Date()),
            isAnonymous,
            text: null,
            title: null,
            total_scores: 0,
            type,
            uuid,
            updated: null,
        };

        let postsRef = db.collection('posts')
        postsRef.add(postsData)
            .then(ref => {
                let post_id = ref.id;
                let target1Data = {
                    name: target1,
                    score: 0,
                    voter: [],
                };
        
                let target2Data = {
                    name: target2,
                    score: 0,
                    voter: [],
                };

                let targetsRef = db.collection('posts').doc(`${post_id}`).collection('targets')
                targetsRef.doc('target1').set(target1Data);
                targetsRef.doc('target2').set(target2Data);                
                
                alert(`${target1} vs ${target2} 완성`);
                resetTarget1();
                resetTarget2();
                
                router.push({ pathname: `/posts/compare/${post_id}`});
        })
    }

    return (
        <div>
            <Head>
                <title>둘 중 선호하는 걸 골라보세요! | 너의선택은</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <NavigationBar />
            <div className="container">
                <main>
                    <h1 className="title">
                        너의선택은
                    </h1>

                    <p className="description">
                        둘 중 뭐가 더 좋은지 골라보세요!
                    </p>
                    <Row className="col-centering home-create-box">
                        <Col sm={12} className="title">
                            <p>비교할 대상을 직접 만들어 보세요!</p>
                        </Col>
                        <Form className="form-box">
                            <Form.Row className="compare-input">
                                <Form.Group as={Col} xs="5">
                                    <Form.Control placeholder="" type="text" {...bindTarget1}/>
                                </Form.Group>
                                <Col xs={2} style={{textAlign: "center"}}>
                                    <h3>VS</h3>
                                </Col>
                                <Form.Group as={Col} xs="5">
                                    <Form.Control placeholder="" type="text" {...bindTarget2}/>
                                </Form.Group>
                                {/* <Form.Group className="writing-box col-centering" controlId="exampleForm.ControlTextarea1">
                                    <Form.Control as="textarea" rows="5"/>
                                </Form.Group> */}
                            </Form.Row>
                            <Row className="col-centering">
                                <Col xs="auto" sm="auto" md="auto">
                                    <Button variant="primary" value="compare" onClick={addPost}>
                                        만들기
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Row>
                    <div className="grid">
                        <CompareLink id={posts[1].id}>
                            <a className="card">
                                <h3>아무거나 구경하기 &rarr;</h3>
                                <p>사람들이 올린 게시물을 랜덤으로 볼 수 있습니다.</p>
                            </a>
                        </CompareLink>
                    </div>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Modal heading</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                            Close
                            </Button>
                            <Button variant="primary" onClick={handleClose}>
                            Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Row>
                        <Col sm={12}>
                            <ul className="list-unstyled">
                                {
                                    posts.map(post => (
                                        <li className="margin-btm">
                                            <CompareLink id={post.id}><a>{post.targets[0].name} vs {post.targets[1].name}</a></CompareLink>
                                        </li>
                                    ))
                                }
                            </ul>
                        </Col>
                    </Row>
                </main>
                <footer>
                    <a
                        href="https://bit.ly/3aSqzQw"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        MVP 사이드 프로젝트 커뮤니티. 킥보드 만드는 사람들
                    </a>
                </footer>
            </div>

            <style jsx>{`
                .container {
                    min-height: 100vh;
                    padding: 0 0.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                main {
                    width:100%
                    padding: 5rem 0;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                footer {
                    width: 100%;
                    height: 100px;
                    border-top: 1px solid #eaeaea;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                footer img {
                    margin-left: 0.5rem;
                }

                footer a {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                a {
                    color: inherit;
                    text-decoration: none;
                }

                .title a {
                    color: #0070f3;
                    text-decoration: none;
                }

                .title a:hover,
                .title a:focus,
                .title a:active {
                    text-decoration: underline;
                }

                .title {
                    margin: 0;
                    line-height: 1.15;
                    font-size: 4rem;
                }

                .title,
                .description {
                    text-align: center;
                }

                .description {
                    line-height: 1.5;
                    font-size: 1.5rem;
                }

                code {
                    background: #fafafa;
                    border-radius: 5px;
                    padding: 0.75rem;
                    font-size: 1.1rem;
                    font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
                    DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
                }

                .grid {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;
                    
                    margin-bottom: 2rem;
                    width: 100%;
                    max-width: 800px;
                    margin-top: 3rem;
                }

                .card {
                    width: 100%;
                    padding: 1.5rem;
                    text-align: left;
                    color: inherit;
                    text-decoration: none;
                    border: 1px solid #eaeaea;
                    border-radius: 10px;
                    transition: color 0.15s ease, border-color 0.15s ease;
                }

                .card:hover,
                .card:focus,
                .card:active {
                    color: #0070f3;
                    border-color: #0070f3;
                }

                .card h3 {
                    margin: 0 0 1rem 0;
                    font-size: 1.5rem;
                }

                .card p {
                    margin: 0;
                    font-size: 1.25rem;
                    line-height: 1.5;
                }

                @media (max-width: 600px) {
                    .grid {
                        width: 100%;
                        flex-direction: column;
                    }
                }
            `}</style>

            <style jsx global>{`

            `}</style>
        </div>
    );
}

home.getInitialProps = async function ({ query }) {
    const db = firebase.firestore();
    let postsRef = db.collection('posts');

    let posts = await new Promise((resolve, reject) => {
        let data = [];
        postsRef.get()
            .then(snapshot => {
                snapshot.forEach((doc) => {
                    data.push(Object.assign({
                        id: doc.id
                    }, doc.data()))
                });
                
                resolve(data);
            })
            .catch((err) => {
                console.log('Error getting documents', err);
                reject([]);
            });
    })
    
    let includePostsTargets = await new Promise((resolve, reject) => {
        let promises = []
        let data = [];

        let i = 0;

        db.collection('posts').get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    let post = doc.data()
                    post.id = doc.id
                    promises.push(doc.ref.collection('targets').get());
                })
                return Promise.all(promises);
            })
            .then(results => {
                let result = [];
                results.forEach(querySnapshot => {
                    querySnapshot.forEach(function (doc) {
                        data.push(Object.assign({
                            id: doc.id
                        }, doc.data()))
                        
                    });
                    result.push(Object.assign({
                        targets: data
                    }, posts[i]))
                    i += 1;
                    data = [];
                });

                resolve(result);
            })
            .catch((err) => {
                console.log('Error getting documents', err);
                reject([]);
            });
    });

    return {
        data: {
            posts: includePostsTargets,
        }
    };
}