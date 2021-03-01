import React, { useRef } from 'react';
import axios from 'axios';

export default function signup() {
	const emailInputRef = useRef('');
	const passwordInputRef = useRef('');

	const onSubmit = async (event) => {
		event.preventDefault();

		const email = emailInputRef.current.value;
		const password = passwordInputRef.current.value;

		const response = await axios.post('/api/users/signup', {
			email,
			password,
		});

		console.log(response.data);
	};

	return (
		<form onSubmit={onSubmit}>
			<h1>Sign Up</h1>
			<div className="form-group">
				<label>Email Address</label>
				<input ref={emailInputRef} className="form-control" />
			</div>
			<div className="form-group">
				<label>Password</label>
				<input
					ref={passwordInputRef}
					type="password"
					className="form-control"
				/>
			</div>
			<button className="btn btn-primary">Sign Up</button>
		</form>
	);
}
