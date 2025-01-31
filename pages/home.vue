<template>
	<UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
		<section class="flex flex-col gap-[15px]">
			<UInput
				type="file"
				size="xl"
				icon="i-heroicons-folder"
				@change="handleFileChange"
			/>

			<UButton v-if="!isUploading" size="md" block @click="uploadFile"
				>Upload</UButton
			>
			<UButton v-else size="md" color="red" block @click="cancelUpload"
				>Cancel</UButton
			>

			<UProgress
				size="xl"
				indicator
				animation="swing"
				:value="uploadProgress"
				:max="100"
			/>
		</section>
	</UCard>
</template>
<script setup>
	import { useAuth } from '~/stores/auth';
	useSeoMeta({
		title: "Home",
	});

	const chunkSize = 5 * 1024 * 1024;

	const file = ref(null);
	const uploadProgress = ref(0);
	const isUploading = ref(false);

	const auth = useAuth();

	const abortController = ref(null);

	const handleFileChange = (event) => {
		const selectedFile = event[0];
		if (!selectedFile) return;

		cancelUpload();

		uploadProgress.value = 0;

		file.value = selectedFile;
	};

	const uploadFile = async () => {
		if (!file.value) return;

		const fileName = file.value.name

		abortController.value = new AbortController();

		isUploading.value = true;

		const totalChunks = Math.ceil(file.value.size / chunkSize);
		try {
			for (let i = 0; i < totalChunks; i++) {
				const start = i * chunkSize;
				const end = Math.min(start + chunkSize, file.value.size);
				const chunk = file.value.slice(start, end);

				const formData = new FormData();
				formData.append("file", chunk);
				formData.append("chunkIndex", i);
				formData.append("totalChunks", totalChunks);
				formData.append("fileName", fileName);

				await fetch("/api/upload", {
					method: "POST",
					body: formData,
					signal: abortController.value.signal,
					headers: {
						'Authorization' : `Bearer ${auth.token}`
					}
				});

				uploadProgress.value = Math.round(
					((i + 1) / totalChunks) * 100
				);
			}
		} catch (error) {
			console.error("Upload failed:", error);
			const formData = new FormData();
			formData.append("fileName", fileName);
			formData.append("totalChunks", totalChunks);
			formData.append("action", "abort");

			await fetch("/api/upload", {
				method: "POST",
				body: formData,
				headers: {
					'Authorization' : `Bearer ${auth.token}`
				}
			});

			uploadProgress.value = 0;
		} finally {
			isUploading.value = false;
		}
	};

	const cancelUpload = () => {
		if (abortController.value) {
			abortController.value.abort("User cancelled the upload");
			abortController.value = null;
			uploadProgress.value = 0;
			isUploading.value = false;
		}
	};
</script>
