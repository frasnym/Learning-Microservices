import React, { useRef, useState } from 'react';
import axios from 'axios';

export default function signup() {
	const emailInputRef = useRef('');
	const passwordInputRef = useRef('');
	const [errors, setErrors] = useState([]);

	const onSubmit = async (event) => {
		event.preventDefault();

		const email = emailInputRef.current.value;
		const password = passwordInputRef.current.value;

		try {
			const response = await axios.post('/api/users/signup', {
				email,
				password,
			});

			console.log(response.data);
		} catch (error) {
			setErrors(error.response.data.errors);
		}
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
			{errors.length > 0 && (
				<div className="alert alert-danger">
					<h4>Ops...</h4>
					<ul className="my-0">
						{errors.map((e) => (
							<li key={e.message}>{e.message}</li>
						))}
					</ul>
				</div>
			)}
			<button className="btn btn-primary">Sign Up</button>
		</form>
	);
}
