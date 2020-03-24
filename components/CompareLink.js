import Link from 'next/link'

const CompareLink = props => (
    <Link
        href=
        {
            `/posts/compare/${props.id}`
        }
    >
        {props.children}
    </Link>
);

export default CompareLink;