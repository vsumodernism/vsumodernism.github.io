<template>
    <Article :article="article"/>
</template>

<script>
import Article from "~/components/cards/Article.vue";

export default defineNuxtComponent({
	name: 'PageArtist',
    components: {
        Article
    },
    data() {
        return {
            article: []
        }
    },
    mounted() {
        this.fetchArtist()
    },
    methods: {
        async fetchArtist() {
            try {
                const response = await $fetch(`/data/artists/${this.$route.params.slug}.json`);
                
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
