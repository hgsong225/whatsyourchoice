/* Frames, Modules, Libraries */
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import fetch from 'isomorphic-unfetch'
import { Container, Row, Col, Modal, Button, Form, FormControl, Image, InputGroup } from 'react-bootstrap'

/* Hooks */
import { useInput } from '../../../hooks/useInput'

/* Configures */
import firebase from '../../../config/firebase'
const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
const arrayUnion = firebase.firestore.FieldValue.arrayUnion;

/* Components */
import NavigationBar from '../../../components/NavigationBar'
import CompareLink from '../../../components/CompareLink'

/* Styles */
import '../../../static/root.css'
import '../../../static/compare.css'

function compare (props) {
    const router = useRouter();
    const db = firebase.firestore();
    const query = router.query;

    /* state */
    const { register, handleSubmit } = useForm();
    const { value: comment, bind: bindComment, reset: resetComment } = useInput('')
    const { value: recomment, bind: bindRecomment, reset: resetRecomment } = useInput('')
    const [ comments, setComments ] = useState([]);
    const [ targets, setTargets ] = useState([
        { name: '', score: null, voter: [] },
        { name: '', score: null, voter: [] },
    ]);
    const [ didVote, setDidVote ] = useState(true);
    const [ voteRates, setVoteRates ] = useState(
        {
            target1: 0,
            target2: 0,
        }
    )

    /* props */
    const uuid = props.user.uuid;
    const isAnonymous = props.user.isAnonymous;
    
    /* data of the post for a current page. */
    // post도 onSnapshot하기
    const post = props.data.post;

    const posts = props.data.posts;
    
    /* Simplification */
    const target1 = targets[0];
    const target2 = targets[1];
    let target1Length = target1.voter.length;
    let target2Length = target2.voter.length;
    const totalNumberVoters = target1Length + target2Length;
    const ratesOfTarget1 = target1.voter.length && (Math.round((target1.voter.length) * 100) / totalNumberVoters).toFixed(2);
    const ratesOfTarget2 = target2.voter.length && (Math.round((target2.voter.length) * 100) / totalNumberVoters).toFixed(2);

    useEffect(() => {
        async function fetchData() {
            // 타겟 받아오기 - 투표 상태 확인
            await db.collection('posts').doc(`${query.id}`).collection('targets')
                .onSnapshot(async docs => {
                    let index = -1;
                    let state_targets = [];
                    docs.forEach(doc => {
                        let data = doc.data();

                        index = data.voter.indexOf(uuid);
                        if (index !== -1) {
                            setDidVote(true);
                        }

                        state_targets.push(data);
                    })

                    if (index == -1) await setDidVote(false);
                    await setTargets(state_targets)

                    let target1Length = state_targets[0].voter.length;
                    let target2Length = state_targets[1].voter.length;
                    const totalNumberVoters = target1Length + target2Length;
                    const ratesOfTarget1 = state_targets[0].voter.length && (Math.round((state_targets[0].voter.length) * 100) / totalNumberVoters).toFixed(2);
                    const ratesOfTarget2 = state_targets[1].voter.length && (Math.round((state_targets[1].voter.length) * 100) / totalNumberVoters).toFixed(2);
                    await setVoteRates({ target1: ratesOfTarget1, target2: ratesOfTarget2})
                })

            //댓글 받아오기
            let commentsRef = db.collection('posts').doc(`${query.id}`).collection('comments').orderBy('created', 'desc')
            await commentsRef.onSnapshot(data => {
                setComments(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
            })
        }

        fetchData();
    }, [])

    const vote = (evt) => {
        evt.preventDefault();

        let targeting = evt.target.value;
        db.collection('posts').doc(`${query.id}`).collection('targets').doc(`${targeting}`)
        .update({
            voter: arrayUnion(uuid),
        })
        .then(res => {
            setDidVote(true)
            let vote_reulst1 = document.getElementById("vote-result1");
            let vote_reulst2 = document.getElementById("vote-result2");
            vote_reulst1.style.display = "block";
            vote_reulst2.style.display = "block";
        });
    }

    const reVote = (evt) => {
        evt.preventDefault();
        
        let newVoters = db.collection('posts').doc(`${query.id}`).collection('targets').where('voter', 'array-contains', uuid)
        .get()
        .then(snapshot => {
            snapshot.docs.forEach(async doc => {
                let data = doc.data();
                let target_id = doc.id;
                let newData = [];

                let index = data.voter.indexOf(uuid);
                if (index > -1) {
                    data.voter.splice(data.voter.indexOf(uuid), 1);
                }

                await db.collection('posts').doc(`${query.id}`).collection('targets').doc(`${target_id}`)
                .update({
                    voter: arrayRemove(uuid),
                })
                .then(res => {
                    setDidVote(false);
                    let vote_reulst1 = document.getElementById("vote-result1");
                    let vote_reulst2 = document.getElementById("vote-result2");
                    vote_reulst1.style.display = "none";
                    vote_reulst2.style.display = "none";
                })
            })
        })
    }

    const addComment = (evt) => {
        evt.preventDefault();

        // 빈 칸일 경우 거부.
        if (!comment.length) {
            return;
        }

        let newComments = {
            created: firebase.firestore.Timestamp.fromDate(new Date()),
            dislike: [],
            like: [],
            text: comment,
            uuid,
            updated: null,
        };
        // let commentsRef = db.collection(`posts/${query.id}/comments`);
        let commentsRef = db.collection('posts').doc(`${query.id}`).collection('comments');
        commentsRef.add(newComments)

        resetComment()
    }

    return (
        <div>
            <div>
                <Head>
                    <title>둘 중 선호하는 걸 골라보세요! | 너의선택은</title>
                    <meta name="description" content={`${post.targets[0].name} vs ${post.targets[1].name} | ${post.targets[1].name} vs ${post.targets[0].name}`} />
                </Head>
                <NavigationBar />
                <Container fluid>
                    <Row>
                        <Col md={9} xl={2} className="row-centering Left-SidePanel-module">
                            <div>
                                {/* <span>광고</span> */}
                            </div>
                        </Col>
                        <main className="Main-styles-module--main col-md-9 col-xl-8 col-12">
                                <Row className="margin-top-btm-lg row-centering">
                                    <Col>
                                        <p className="text-align-center"><strong>당신의 선택은?</strong></p>
                                    </Col>
                                </Row>
                                <Row className="vote-container justify-content-center">
                                    <Col xs={5} md={5} className="margin-top-btm-lg col-centering">
                                        <h2 className="margin-top-btm-lg">{target1.name}</h2>
                                        <Button className="margin-top-btm-lg" value="target1" onClick={vote}
                                            disabled={didVote}
                                        >투표하기</Button>
                                        <h3 className="margin-top-btm-lg" id="vote-result1">{voteRates.target1}%</h3>
                                    </Col>
                                    <Col xs={1} md={1} className="margin-top-btm-lg col-centering">
                                        <h2 className="margin-top-btm-lg" style={{textAlign: "center"}}>VS</h2>
                                    </Col>
                                    <Col xs={5} md={5} className="margin-top-btm-lg col-centering">
                                        <h2 className="margin-top-btm-lg">{target2.name}</h2>
                                        <Button className="margin-top-btm-lg" value="target2" onClick={vote}
                                            disabled={didVote}
                                        >투표하기</Button>
                                        <h3 className="margin-top-btm-lg" id="vote-result2">{voteRates.target2}%</h3>
                                    </Col>
                                </Row>

                                <Row className="task-container">
                                    <Col sm={12}>
                                        <Row className="justify-content-lg-center">
                                            <Col sm={4} md={4} lg={3} className="row-centering"><p></p></Col>
                                            <Col sm={4} md={4} lg={3} className="row-centering">
                                                <p className="cursor-pointer margin-unstyled" onClick={reVote}>
                                                    재투표하기
                                                </p>
                                            </Col>
                                            {/* <Col sm={4} md={4} lg={3} className="row-centering"><p className="cursor-pointer">나도만들기</p></Col> */}
                                            <Col sm={4} md={4} lg={3} className="row-centering">
                                                <Link href="/"><a>나도 만들기</a></Link>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col sm={12}>
                                        <Row className="justify-content-center">
                                            <Col lg={9} className="cursor-pointer col-centering">
                                                <div className="ad-google-example">
                                                    {/* 구글 애드센스 광고입니다. */}
                                                </div>
                                            </Col>
                                        </Row>

                                    </Col>
                                    <Col sm={12}>
                                        <Row md={3} className="margin-btm justify-content-lg-center">
                                            <Col sm={4} md={4} lg={3} className="row-centering"><p className="margin-top margin-unstyled">다음 게시물</p></Col>
                                            <Col sm={4} md={4} lg={3} className="row-centering">
                                                <CompareLink id={posts[0].id}><a>{posts[0].targets[0].name} vs {posts[0].targets[1].name}</a></CompareLink >
                                            </Col>
                                            <Col sm={4} md={4} lg={3} className="row-centering">
                                                <CompareLink id={posts[0].id}><a>아무거나 보기</a></CompareLink>
                                            </Col>
                                        </Row>

                                    </Col>
                                    <Col sm={12}>
                                        <Row>
                                            <Col className="share-btn margin-top-btm-lg col-centering"><p className="cursor-pointer">공유하기</p></Col>
                                        </Row>
                                    </Col>
                                </Row>


                                <Row md={3} className="justify-content-lg-center">
                                    {/* <Col lg={9} className="description-container col-centering">
                                        <p className="">
                                            작성자 설명란
                                        </p>
                                    </Col> */}
                                    <Col lg={9} className="comments-container col-centering">
                                        <Row>
                                            <Col>
                                                <p className="margin-top-btm-lg"><strong>커뮤니티</strong></p>
                                            </Col>
                                        </Row>
                                        <Form className="w-fluid col-centering">
                                            <Form.Group className="writing-box col-centering" controlId="exampleForm.ControlTextarea1">
                                                    <Form.Control as="textarea" rows="5" {...bindComment}/>
                                            </Form.Group>
                                            <Col className="margin-top-btm-lg col-centering">
                                                <Button
                                                    onClick={addComment}
                                                >
                                                    댓글달기
                                                </Button>
                                            </Col>
                                        </Form>
                                        <Row className="margin-top-btm-lg">
                                            {/* <Col xs={6} className="cursor-pointer row-centering">
                                                <span>인기순</span>
                                            </Col> */}
                                            <Col xs={12} className="cursor-pointer row-centering">
                                                <span>최신순</span>
                                            </Col>
                                        </Row>
                                        {
                                            comments.map(comment => (
                                                <Row className="w-fluid">
                                                    <Col sm={12} className="comment-box">
                                                        <Row className="comment align-items-center">
                                                            <Col sm={2} className="sm-row-start col-centering">
                                                                <Image src="../../../default-profile2.png/" roundedCircle />
                                                                <span>익명</span>
                                                            </Col>
                                                            <Col sm={8}>
                                                                <div className="col-start">
                                                                    <p>
                                                                        {comment.text}
                                                                    </p>
                                                                    <div className="row-start">
                                                                        <span>좋아요</span>
                                                                        <span>{comment.like.length}</span>
                                                                        <span>싫어요</span>
                                                                        <span>{comment.dislike.length}</span>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                            <Col sm={2}>
                                                                <span>{comment.created.seconds}</span>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            ))
                                        }
                                    </Col>
                                </Row>
                        </main>
                        <Col md={3} xl={2} className="d-none d-md-block margin-btm col-centering Right-SidePanel-module">
                            <ul className="list-unstyled">
                                <p>당신의 선택은?</p>
                                {
                                    posts.map(post => (
                                        <li className="margin-btm"><CompareLink id={post.id}><a>{post.targets[0].name} vs {post.targets[1].name}</a></CompareLink></li>
                                    ))
                                }
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </div>
            <style jsx>{`

            `}</style>
        </div>
    );
}

compare.getInitialProps = async function({ query }) {
    let db = firebase.firestore();
    
    // let museums = db.collection('posts').doc(`${query.id}`).collection('comments');
    // let museums = db.collectionGroup('comments');

    /* 해당 포스트만 */
    let postsRef = db.collection('posts');
    let post = await new Promise((resolve, reject) => {
        let data = [];
        postsRef.doc(`${query.id}`).get()
            .then(doc => {
                data.push(Object.assign({
                    id: doc.id
                }, doc.data()))

                resolve(data);
            })
            .catch((err) => {
                console.log('Error getting documents', err);
                reject([]);
            });
    });

    let targetsRef = db.collection(`posts/${query.id}/targets`);
    let targets = await new Promise((resolve, reject) => {
        let data = [];
        targetsRef.get()
            .then(snapshot => {
                snapshot.forEach((doc) => {
                    data.push(Object.assign({
                        id: doc.id
                    }, doc.data()))
                })

                resolve(data);
            })
            .catch((err) => {
                console.log('Error getting documents', err);
                reject([]);
            });
    });

    // let includeRecomments = await new Promise((resolve, reject) => {
    //     let promises = []
    //     let data = [];

    //     let i = 0;

    //     db.collection('posts').doc(`${query.id}`).collection('comments')
    //         .get()
    //         .then(snapshot => {
    //             snapshot.forEach(doc => {
    //                 let comments = doc.data()
    //                 comments.id = doc.id
    //                 console.log('asdf', comments.id);
    //                 promises.push(doc.ref.collection('re-comments').get());
    //             })
    //             return Promise.all(promises);
    //         })
    //         .then(results => {
    //             let result = [];
    //             results.forEach(querySnapshot => {
    //                 querySnapshot.forEach(function (doc) {
    //                     data.push(Object.assign({
    //                         id: doc.id
    //                     }, doc.data()))
                        
    //                 });
    //                 result.push(Object.assign({
    //                     recomments: data
    //                 }, comments[i]))

    //                 console.log(comments[i]);
    //                 i += 1;
    //                 data = [];
    //             });
    //             console.log(result);
    //             resolve(result);
    //         })
    //         .catch((err) => {
    //             console.log('Error getting documents', err);
    //             reject([]);
    //         });
    // });
                                

    /* 포스트 7개 불러오기 */
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
          post: Object.assign({
            targets,
        }, post[0]),
          posts: includePostsTargets,
      }
    };
};
  
export default compare;
