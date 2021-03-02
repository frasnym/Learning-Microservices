import axios from 'axios';

export default function buildClient({ req }) {
	if (typeof window === 'undefined') {
		/**
		 * We are on the server!
		 * Request should be made with base url of http://SERVICENAME.NAMESPACE.svc.cluster.local
		 * How to get:
		 * 1. kubectl get namespace
		 * 2. kubectl get services -n [SERVICE_NAME]
		 */
		return axios.create({
			baseURL:
				'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/',
			headers: req.headers,
		});
	} else {
		/**
		 * We are on the browser!
		 * Request can be made with a base url or ''
		 */
		return axios.create({
			baseURL: '/',
		});
	}
}
