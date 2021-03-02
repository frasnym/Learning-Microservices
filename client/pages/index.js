import React from 'react';
import axios from 'axios';

const LandingPage = ({ currentUser }) => {
	console.log({ currentUser });
	return <h1>Landing</h1>;
};

LandingPage.getInitialProps = async () => {
	if (typeof window === 'undefined') {
		/**
		 * We are on the server!
		 * Request should be made with base url of http://SERVICENAME.NAMESPACE.svc.cluster.local
		 * How to get:
		 * 1. kubectl get namespace
		 * 2. kubectl get services -n [SERVICE_NAME]
		 */
		const { data } = await axios.get(
			'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
			{
				headers: {
					Host: 'ticketing.dev',
				},
			}
		);
		return data;
	} else {
		/**
		 * We are on the browser!
		 * Request can be made with a base url or ''
		 */
		const { data } = await axios.get('/api/users/currentuser');
		return data;
	}
};

export default LandingPage;
