<template>
    <Slider v-if="article?.length && article[0].view === 'slider'" :article="article[0]"/>
    <Article :article="article"/>
</template>

<script>
import Article from "~/components/cards/Article.vue";
import Slider from "~/components/UI/Slider.vue";

export default defineNuxtComponent({
	name: 'PageHome',
    components: {
        Article,
        Slider
    },
    data() {
        return {
            article: []
        }
    },
    mounted() {
        this.fetchMain()
    },
    methods: {
        async fetchMain() {
            try {
                const response = await $fetch('/data/main.json');
                
                if (response) {
                    this.article = response;
                }
            } catch (e) {
                console.log(e)
            }
        },
    }
})
</script>

<style scoped lang="scss">


</style>
