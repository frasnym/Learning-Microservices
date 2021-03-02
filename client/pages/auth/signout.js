import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import useRequest from '../../hooks/use-request';

export default function Signout() {
	const router = useRouter();
	const { doRequest } = useRequest({
		url: '/api/users/signout',
		method: 'post',
		body: {},
		onSuccess: () => router.push('/'),
	});

	useEffect(() => {
		doRequest();
	}, []);

	return <div>Signing out...</div>;
}
