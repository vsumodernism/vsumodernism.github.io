<template>
	<div>
        <h1 class="title_size_40 mb-15">Основные направления модернизма</h1>
        <p class="text-gray">Текст который я могу менять</p>
        
        <div v-if="movements.length" class="list-movements mt-40">
            <div v-for="card in movements" class="card-movements" @click="$router.push(`/art-movements/${card.slug}`)">
                <img :src="card.img" class="card-movements__image"/>
                <h3 class="card-movements__title">{{card.title}}</h3>
                <p class="card-movements__description">{{card.description}}</p>
            </div>
        </div>
	</div>
</template>

<script>
// import {useStore} from "~/stores/store.js";

export default defineNuxtComponent({
	name: 'PageArtMovements',
	async setup() {
        // const store = import.meta.client ? useStore() : null;
		// const store = useStore();
		let movements = [];

		try {
            // if (process.server) {
            //     response = await useFetch('/api/art-movements')
            // } else {
            //     response = await $fetch('/api/art-movements');
            // }

			const response = await $fetch('/data/art-movements.json');
            console.log('response', response)

			if (response) {
                movements = response;
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
    cursor: pointer;
    
    &__image {
        width: 100%;
        aspect-ratio: 1/1;
        border-radius: 15px;
        object-fit: cover;
        margin-bottom: 15px;
    }

    &__title {
        font-size: 17px;
        font-weight: bold;
    }

    &__description {
        margin-top: 5px;
        color: var(--neutrals4);
        font-size: 12px;
    }
}
</style>
