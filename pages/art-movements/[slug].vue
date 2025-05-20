<template>
    <div class="btn-back" @click="$router.back()">
        <IconBack/>
        Назад
    </div>

    <Article :article="article"/>
</template>

<script>
import Article from '~/components/cards/Article.vue'
import IconBack from "~/components/icons/IconBack.vue";

export default defineNuxtComponent({
	name: 'PageArtMovement',
    components: {
        Article,
        IconBack
    },
    data() {
        return {
            article: []
        }
    },
    mounted() {
        this.fetchArtMovement()
    },
    methods: {
        async fetchArtMovement() {
            try {
                const response = await $fetch(`/data/art-movements/${this.$route.params.slug}.json`);
                
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
