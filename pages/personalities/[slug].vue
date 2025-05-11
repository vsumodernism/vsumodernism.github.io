<template>
	<div>
        <h1 class="title_size_40">Основные направления модернизма</h1>
        <p class="text-gray">Текст который я могу менять</p>
        
        <div class="list-movements">
<!--            <div v-for="card in movements" class="card-movements">-->
<!--                <img :src="card.img" class="card-movements__image"/>-->
<!--                <h3 class="card-movements__title">{{card.title}}</h3>-->
<!--                <p class="card-movements__description">{{card.description}}</p>-->
<!--            </div>-->
        </div>
	</div>
</template>

<script>
export default defineNuxtComponent({
	name: 'PageArtMovements',
	async setup() {
        // const store = process.client ? useStore() : null;
		// const store = useStore();
		let movements = [];

		// try {
		// 	const response = await $fetch('/data/art-movements.json');
        //
		// 	if (response) {
        //         movements = response;
		// 	}
		// } catch (e) {
        //     console.log(e)
		// }

		// useSeoMeta({
		// 	title: t('pages.games.title'),
		// 	ogTitle: t('pages.games.title'),
		// 	description: t('pages.games.description'),
		// 	ogDescription: t('pages.games.description'),
		// 	ogImage: $config.public.OG_DEFAULT_IMAGE,
		// 	robots: 'index, follow'
		// });

		return {
			// store,
            movements
		}
	},
})
</script>

<style scoped lang="scss">
.list-movements {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.card-movements {
    width: 256px;
    
    &__image {
        width: 100%;
        aspect-ratio: 1/1;
        border-radius: 15px;
        object-fit: cover;
    }

    &__title {
    
    }

    &__description {
    
    }
}
</style>
