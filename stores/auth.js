
export const useAuth = () => {
    const token = useCookie('auth_token');

	const setToken = (newToken) => {
		token.value = newToken;
	};

	const logout = () => {
		token.value = null;
	};

	return { token, setToken, logout };
};
