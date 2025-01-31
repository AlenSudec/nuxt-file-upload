<script setup>
	import { useAuth } from "~/stores/auth";

	definePageMeta({
		layout: "auth",
	});

	useSeoMeta({
		title: "Login",
	});

	const router = useRouter();

	const auth = useAuth();

	const fields = [
		{
			name: "username",
			type: "username",
			label: "Username",
			placeholder: "Enter your username",
		},
		{
			name: "password",
			label: "Password",
			type: "password",
			placeholder: "Enter your password",
		},
	];

	const validate = (state) => {
		const errors = [];
		if (!state.username)
			errors.push({ path: "username", message: "Username is required" });
		if (!state.password)
			errors.push({ path: "password", message: "Password is required" });
		return errors;
	};

	const onSubmit = async (data) => {
		console.log("Submitted", data);

		try {
			const response = await fetch("/api/login", {
				method: "POST",
				body: JSON.stringify({
					username: data.username,
					password: data.password,
				}),
        headers: {'Content-Type': 'application/json'}

			});
			const { token } = await response.json();

			auth.setToken(token);
			router.push("/home");
		} catch (error) {
			console.error("Login failed", error);
		}
	};
</script>

<template>
	<UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
		<AuthForm
			:fields="fields"
			:validate="validate"
			title="Welcome back"
			align="top"
			icon="i-heroicons-lock-open"
			:ui="{ base: 'text-center', footer: 'text-center' }"
			:submit-button="{
				trailingIcon: 'i-heroicons-arrow-right-20-solid',
			}"
			@submit="onSubmit"
		>
			<template #description>
				Don't have an account?
				<NuxtLink to="/register" class="text-primary font-medium"
					>Sign up</NuxtLink
				>.
			</template>

			<!-- <template #password-hint>
        <NuxtLink
          to="/"
          class="text-primary font-medium"
        >Forgot password?</NuxtLink>
      </template> -->

			<!-- <template #footer>
        By signing in, you agree to our <NuxtLink
          to="/"
          class="text-primary font-medium"
        >Terms of Service</NuxtLink>.
      </template> -->
		</AuthForm>
	</UCard>
</template>
