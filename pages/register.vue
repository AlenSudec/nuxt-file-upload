<script setup>
	definePageMeta({
		layout: "auth",
	});

	useSeoMeta({
		title: "Register",
	});

	const router = useRouter();

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

	// const providers = [{
	//   label: 'Continue with GitHub',
	//   icon: 'i-simple-icons-github',
	//   color: 'white',
	//   click: () => {
	//     console.log('Redirect to GitHub')
	//   }
	// }]

	const onSubmit = async (data) => {
		console.log("Submitted", data);

		try {
			await fetch("/api/register", {
				method: "POST",
				body: JSON.stringify({
					username: data.username,
					password: data.password,
				}),
                headers: {'Content-Type': 'application/json' }
			});
			
			router.push("/");
		} catch (error) {
			console.error("REgistration failed", error);
		}
	};
</script>

<template>
	<UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
		<AuthForm
			:fields="fields"
			:validate="validate"
			title="Create an account"
			align="top"
			icon="i-heroicons-lock-closed"
			:ui="{ base: 'text-center', footer: 'text-center' }"
			:submit-button="{
				trailingIcon: 'i-heroicons-arrow-right-20-solid',
			}"
			@submit="onSubmit"
		>
			<template #description>
				Already have an account?
				<NuxtLink to="/" class="text-primary font-medium"
					>Login</NuxtLink
				>.
			</template>
		</AuthForm>
	</UCard>
</template>
