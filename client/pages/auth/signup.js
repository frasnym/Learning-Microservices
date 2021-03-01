import React, { useRef, useState } from 'react';

export default function signup() {
	const emailInputRef = useRef('');
	const passwordInputRef = useRef('');

	const onSubmit = (event) => {
		event.preventDefault();

		console.log(
			emailInputRef.current.value,
			passwordInputRef.current.value
		);
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
