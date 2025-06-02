<template>
    <div>
        <h1 class="title_size_40 mb-15">Источники</h1>
        <p class="text-gray">Изображения картин, скульптур и архитектурных объектов взяты из открытых образовательных источников, используемых исключительно в учебных целях. Все визуальные материалы используются в рамках образовательного проекта и не предполагают коммерческого использования..</p>
        
        <ol v-if="terms.length" class="list-terms mt-40">
            <li v-for="card in terms" class="card-term">
                <p class="card-term__description" v-html="card.text"></p><a v-if="card.link" class="card-term__link" :href="card.link">Ссылка</a>
            </li>
        </ol>
    </div>
</template>

<script>
export default defineNuxtComponent({
    name: 'PageSources',
    data() {
        return {
            terms: []
        }
    },
    mounted() {
        this.fetchSources()
    },
    methods: {
        async fetchSources() {
            try {
                const response = await $fetch('/data/sources.json');
                
                if (response) {
                    this.terms = response;
                }
            } catch (e) {
                console.log(e)
            }
        },
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
    padding-left: 0;
    counter-reset: term;
    
    @media (max-width: 425px) {
        width: 100%;
    }
}

.card-term {
    display: flex;
    gap: 5px;
    counter-increment: term;
    padding: 20px 20px 20px 30px;
    border-radius: 10px;
    background-color: var(--neutrals1);
    
    &::before {
        content: counter(term) ". ";
        color: var(--neutrals4);
    }

    &__name {
        font-size: 17px;
        margin-bottom: 11px;
    }
    
    &__description {
        color: var(--neutrals4);
        white-space: break-spaces;
        word-break: break-word;
    }

    &__link {
        color: #0906B9;
        text-decoration: none;
    }
}
</style>
