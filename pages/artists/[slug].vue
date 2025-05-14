<template>
    <Article :article="article"/>
</template>

<script>
export default defineNuxtComponent({
	name: 'PageArtist',
	async setup() {
		let article;
        const route = useRoute();

		try {
			const response = await $fetch(`/data/artists/${route.params.slug}.json`);

			if (response) {
                article = response;
			}
		} catch (e) {
            console.log(e)
		}

		// useSeoMeta({
		// 	title: t('pages.games.title'),
		// 	ogTitle: t('pages.games.title'),
		// 	description: t('pages.games.description'),
		// 	ogDescription: t('pages.games.description'),
		// 	ogImage: $config.public.OG_DEFAULT_IMAGE,
		// 	robots: 'index, follow'
		// });

		return {
            article
		}
	},
})
</script>

<style scoped lang="scss">

</style>
