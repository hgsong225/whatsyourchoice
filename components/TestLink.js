import Link from 'next/link'

const TestLink = props => (
    <Link
        href=
        {
            `/posts/compare/${props.id}`
        }
    >
        {props.children}
    </Link>
);

export default TestLink;

