import { HoudiniClient } from '$houdini';
import { PUBLIC_API_URL } from '$env/static/public';

export default new HoudiniClient({
	url: process.env.PUBLIC_API_URL || 'http://localhost:4000/graphql'
});
