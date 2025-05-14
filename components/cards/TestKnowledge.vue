<script setup>
import Button from "~/components/UI/Button.vue";
</script>

<template>
    <div class="test-knowledge">
        <h3 class="title_size_16 font-500 mb-5">Проверь свои знания</h3>
        <p class="title_size_12 text-gray">Подготовься к зачёту<br> в интерактивной форме</p>
        <Button to="/" width="100%" size="s" style="margin-top: auto">Изучать Артефакты</Button>
    </div>
</template>

<style scoped lang="scss">
.test-knowledge {
    display: flex;
    flex-direction: column;
    min-height: 215px;
    height: 215px;
    padding: 15px 10px;
    margin-top: auto;
    background-color: var(--neutrals2);
    background-image: url('/images/brash@2x.jpg');
    background-position: 100% 22px;
    background-size: 173px;
    background-repeat: no-repeat;
}
</style>