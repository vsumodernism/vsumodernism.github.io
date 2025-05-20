<template>
    <div class="btn-back" @click="$router.back()">
        <IconBack/>
        Назад
    </div>

    <Article :article="article"/>
</template>

<script>
import Article from "~/components/cards/Article.vue";
import IconBack from "~/components/icons/IconBack.vue";

export default defineNuxtComponent({
	name: 'PageArtist',
    components: {
        IconBack,
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
