<template>
    <div class="page-wrapper">
<!--		<Header/>-->
		<main>
			<Error404 v-if="error.statusCode === 404"/>
			<Errors v-else/>
		</main>
    </div>
</template>

<script setup>
defineProps({
	error: Object
})
</script>
