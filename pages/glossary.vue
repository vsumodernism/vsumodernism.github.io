<template>
    <div>
        <h1 class="title_size_40 mb-15">Глоссарий</h1>
        <p class="text-gray mb-30">{{terms.length}} терминов</p>
        
        <Input v-model="search" placeholder="Поиск...">
            <template #prepend>
                <IconSearch/>
            </template>
        </Input>
        
        <div v-if="filteredTerms.length" class="list-terms mt-40">
            <div v-for="card in filteredTerms" class="card-term">
                <h2 class="card-term__name">{{card.name}}</h2>
                <p class="card-term__description mt-10">{{card.description}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import Input from "~/components/UI/Input.vue";
// import {useStore} from "~/stores/store.js";

export default defineNuxtComponent({
    name: 'PageGlossary',
    components: {
        Input
    },
    async setup() {
        // const store = process.client ? useStore() : null;
        // const store = useStore();
        let terms = [];
        
        try {
            const response = await $fetch('/data/glossary.json');
            
            if (response) {
                terms = response;
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
            terms
        }
    },
    data() {
        return {
            search: ''
        }
    },
    computed: {
        filteredTerms() {
            const search = this.search.toLowerCase()

            return this.terms.filter(item => item.name.toLowerCase().includes(search))
        }
    }
})
</script>

<style scoped lang="scss">
.list-terms {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 815px;
    margin-inline: auto;
}

.card-term {
    padding: 20px;
    border-radius: 10px;
    background-color: var(--neutrals1);
    
    &__name {
        font-size: 17px;
        margin-bottom: 11px;
    }
    
    &__description {
        color: var(--neutrals4);
    }
}
</style>
