<template>
	<div>
        <h1 class="title_size_40 mb-15">Персоналии</h1>
        <p class="text-gray mb-30">{{artists.length}} авторов</p>
        
        <Input v-model="search" placeholder="Поиск...">
            <template #prepend>
                <IconSearch/>
            </template>
        </Input>

        <div v-if="filteredArtists.length" class="list-artists mt-40">
            <div v-for="card in filteredArtists" class="card-person">
                <div style="display: flex; gap:10px; align-items: center">
                    <img :src="card.avatar" class="card-person__avatar"/>
                    <div>
                        <h3 class="card-person__name">{{card.name}}</h3>
                        <div class="card-person__dates">{{card.dates}}</div>
                    </div>
                    <Button v-if="isMobile === false" :to="`/personalities/${card.slug}`" style="margin-left: auto">Изучить автора</Button>
                </div>

                <p class="card-person__description mt-10">{{card.description}}</p>
                
                <Button v-if="isMobile" :to="`/personalities/${card.slug}`" style="width: 100%; margin-bottom: 25px">Изучить автора</Button>
                
                <ul v-if="card.tags.length" class="card-person__tags">
                    <li v-for="tag in card.tags" class="card-person__tag">{{tag}}</li>
                </ul>

                <div v-if="card.pictures.length" class="list-pictures">
                    <div class="list-pictures__slider">
                        <div v-for="picture in card.pictures" class="picture">
                            <img :src="picture.img" class="picture__img"/>
                            <div class="picture__name">«{{picture.name}}»</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
	</div>
</template>

<script>
import Button from "~/components/UI/Button.vue";

export default defineNuxtComponent({
	name: 'PageArtists',
    components: {
        Button
    },
	async setup() {
        // const store = process.client ? useStore() : null;
		// const store = useStore();
		let artists = [];

		try {
            const response = await $fetch('/data/artists.json');

			if (response) {
                artists = response;
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
            artists
		}
	},
    data() {
        return {
            search: '',
            isMobile: null
        }
    },
    computed: {
        filteredArtists() {
            const search = this.search.toLowerCase()
            
            return this.artists.filter(item => item.name.toLowerCase().includes(search))
        }
    },
    mounted() {
        setTimeout(() => {
            const pageWrapper = document.querySelector('.page-wrapper');
            
            if (pageWrapper && pageWrapper.classList.contains('is-mobile')) {
                this.isMobile = true
            }
        }, 500)
    }
})
</script>

<style scoped lang="scss">
.list-artists {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 815px;
    margin-inline: auto;
    
    @media (max-width: 425px) {
        width: 100%;
    }
}

.list-pictures {
    @media (max-width: 425px) {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
    
    &__slider {
        display: flex;
        gap: 15px;
        
        @media (max-width: 425px) {
            scroll-snap-type: x mandatory;
        }
    }
}

.picture {
    max-width: 246px;
    
    @media (max-width: 425px) {
        flex: 0 0 auto;
        width: 80%; /* или 100% для 1 картинки на экран */
        scroll-snap-align: start;
    }
    
    &__img {
        width: 100%;
        aspect-ratio: 246/173;
        border-radius: 10px;
        object-fit: cover;
    }
    
    &__name {
        margin-top: 10px;
        font-size: 15px;
        font-weight: 500;
    }
}

.card-person {
    padding: 20px;
    border-radius: 10px;
    background-color: var(--neutrals1);
    
    &__avatar {
        width: 75px;
        height: 75px;
        object-fit: cover;
        border-radius: 50%;
    }

    &__name {
        margin-bottom: 5px;
    }

    &__dates {
        color: var(--neutrals4);
    }

    &__description {
        margin-bottom: 25px;
        color: var(--neutrals4);
    }

    &__tags {
        display: flex;
        gap: 10px;
        margin-bottom: 25px;
    }

    &__tag {
        padding: 5px;
        border-radius: 4px;
        background-color: var(--neutrals3);
    }
}
</style>
