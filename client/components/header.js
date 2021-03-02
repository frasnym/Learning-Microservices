import React from 'react';
import Link from 'next/link';

export default function Header({ currentUser }) {
	return (
		<nav className="navbar navbar-light bg-light">
			<Link href="/">
				<a className="navbar-brand">GitTix</a>
			</Link>

			<div className="d-flex justify-content-end">
				<ul className="nav d-flet align-items-center">
					{currentUser ? 'Sign Out' : 'Sign In/Up'}
				</ul>
			</div>
		</nav>
	);
}
