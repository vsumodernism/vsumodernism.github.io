<template>
	<div>
        <h1 class="title_size_40 mb-15">Основные направления модернизма</h1>
        <p class="text-gray">{{movements.length}} {{$helpers.pluralizeRu(movements.length, ['направление', 'направления', 'направлений'])}}</p>
        
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
import Article from '~/components/cards/Article.vue'

export default defineNuxtComponent({
	name: 'PageArtMovements',
    data() {
        return {
            movements: [],
        }
    },
    async mounted() {
        this.fetchMovements()
    },
    methods: {
        async fetchMovements() {
            try {
                const response = await $fetch('/data/art-movements.json');
                
                if (response) {
                    this.movements = response;
                }
            } catch (e) {
                console.log(e)
            }
        },
    }
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
    
    @media (max-width: 425px) {
        width: 100%;
    }

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
