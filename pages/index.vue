<template>
    <Article :article="article"/>
</template>

<script>
export default defineNuxtComponent({
	name: 'PageHome',
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
