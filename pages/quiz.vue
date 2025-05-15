<template>
    <div>
        <h1 class="title_size_40 mb-15">Изучение Артефактов</h1>
        <p class="text-gray mb-30">Карточки помогут запомнить визуальные образы, имена авторов и особенности стиля.</p>
        
        <div class="quiz-intro">
            <b>Твоя задача — вытащить из памяти</b>
            <ul>
                <li>Посмотри на изображение.</li>
                <li>Проговори вслух: название, автор, стиль, эпоха и время.</li>
                <li>Если знаешь — смахни вправо. Если нет — влево, и возвращайся повторить позже</li>
            </ul>
        </div>
        
<!--        <div v-if="tests.length" class="quiz mt-40">-->
<!--            <div v-for="row in tests" class="gallery-row">-->
<!--                <div v-for="picture in tests" class="card">-->
<!--                    <div class="picture__cover"-->
<!--                         :class="{'picture__cover_fields': picture.view === 'fields'}"-->
<!--                         :style="picture?.bg ? `background-color: #${picture.bg}` : null">-->
<!--                        <img :src="picture.img" class="picture__img"/>-->
<!--                        <div class="picture__style">{{picture.style}}</div>-->
<!--                    </div>-->
<!--                    <h3 class="picture__name">«{{picture.name}}»</h3>-->
<!--                    <p class="picture__author">{{picture.author}}</p>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
        
        <div class="slider">
            <!-- Обёртка слайдов -->
            <div class="slider__viewport">
                <div
                    class="slider__container"
                    :style="containerStyle"
                >
                    <div
                        v-for="slide in tests"
                        :key="slide.id"
                        class="slider__slide"
                    >
                        <div class="quiz-card" :class="{'quiz-card_active': slide.active}" @click="onFlipCard(slide)">
                            <div class="quiz-card__inner" >
                                <div class="quiz-card__front">
                                    <img :src="slide.img" :alt="slide.name" class="slider__img" />
                                </div>
                                
                                <div class="quiz-card__back">
                                    <h3 class="slider__title">«{{ slide.name }}»</h3>
                                    <p class="slider__author">{{ slide.author }}</p>
                                    <p class="slider__text">{{ slide.style }}</p>
                                    <p class="slider__text">{{ slide.date }}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            
            <!-- Кнопки управления -->
            <div class="slider__footer">
                <button @click="restart" class="slider__btn">
                    Начать сначала
                </button>
                
                <div class="slider__controls">
                    <button
                        @click="prevSlide"
                        :disabled="currentIndex === 0"
                        class="slider__btn-icon"
                    >
                        <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="45" height="45" rx="10" fill="#313131"/>
                            <path d="M21.245 22.972C21.1829 22.9101 21.1336 22.8365 21.1 22.7555C21.0664 22.6745 21.0491 22.5877 21.0491 22.5C21.0491 22.4123 21.0664 22.3255 21.1 22.2445C21.1336 22.1635 21.1829 22.0899 21.245 22.028L27.3596 15.9147C27.7348 15.5396 27.9457 15.0309 27.9458 14.5005C27.9459 13.97 27.7353 13.4612 27.3603 13.086C26.9853 12.7108 26.4766 12.4999 25.9461 12.4998C25.4156 12.4997 24.9068 12.7103 24.5316 13.0853L18.417 19.2C17.5433 20.076 17.0527 21.2628 17.0527 22.5C17.0527 23.7372 17.5433 24.9239 18.417 25.8L24.5316 31.9147C24.9068 32.2897 25.4156 32.5003 25.9461 32.5002C26.4766 32.5 26.9853 32.2892 27.3603 31.914C27.7353 31.5388 27.9459 31.03 27.9458 30.4995C27.9457 29.969 27.7348 29.4603 27.3596 29.0853L21.245 22.972Z" fill="white"/>
                        </svg>
                    </button>
                    
                    <!-- Счётчик -->
                    <div class="slider__counter">
                        {{ currentIndex + 1 }}/{{ totalSlides }}
                    </div>
    
                    <button
                        @click="nextSlide"
                        :disabled="currentIndex === totalSlides - 1"
                        class="slider__btn-icon"
                    >
                        <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="45" height="45" rx="10" transform="matrix(-1 0 0 1 45 0)" fill="#313131"/>
                            <path d="M23.755 22.972C23.8171 22.9101 23.8664 22.8365 23.9 22.7555C23.9336 22.6745 23.9509 22.5877 23.9509 22.5C23.9509 22.4123 23.9336 22.3255 23.9 22.2445C23.8664 22.1635 23.8171 22.0899 23.755 22.028L17.6404 15.9147C17.2652 15.5396 17.0543 15.0309 17.0542 14.5005C17.0541 13.97 17.2647 13.4612 17.6397 13.086C18.0147 12.7108 18.5234 12.4999 19.0539 12.4998C19.5844 12.4997 20.0932 12.7103 20.4684 13.0853L26.583 19.2C27.4567 20.076 27.9473 21.2628 27.9473 22.5C27.9473 23.7372 27.4567 24.9239 26.583 25.8L20.4684 31.9147C20.0932 32.2897 19.5844 32.5003 19.0539 32.5002C18.5234 32.5 18.0147 32.2892 17.6397 31.914C17.2647 31.5388 17.0541 31.03 17.0542 30.4995C17.0543 29.969 17.2652 29.4603 17.6404 29.0853L23.755 22.972Z" fill="white"/>
                        </svg>
                    </button>
                </div>
                
                <button @click="shuffleSlides" class="slider__btn">
                    Перемешать
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default defineNuxtComponent({
    name: 'PageQuiz',
    // async setup() {
    //     let tests = reactive([]);
    //
    //     try {
    //         const response = await $fetch('/data/quiz.json');
    //
    //         if (response) {
    //             tests = response;
    //         }
    //     } catch (e) {
    //         console.log(e)
    //     }
    //
    //     tests.forEach(item => item.active = false)
    //     // useSeoMeta({
    //     // 	title: t('pages.games.title'),
    //     // 	ogTitle: t('pages.games.title'),
    //     // 	author: t('pages.games.description'),
    //     // 	ogDescription: t('pages.games.description'),
    //     // 	ogImage: $config.public.OG_DEFAULT_IMAGE,
    //     // 	robots: 'index, follow'
    //     // });
    //
    //     return {
    //         tests
    //     }
    // },
    data() {
        return {
            currentIndex: 0,
            isActive: false,
            tests: []
        }
    },
    computed: {
        totalSlides() {
            return this.tests.length;
        },
        containerStyle() {
            return {
                display: 'flex',
                width: `${this.totalSlides * 100}%`,
                transform: `translateX(-${this.currentIndex * (100 / this.totalSlides)}%)`,
                transition: 'transform 0.5s ease'
            }
        }
    },
    mounted() {
        this.fetchTests()
    },
    methods: {
        async fetchTests() {
            try {
                const response = await $fetch('/data/quiz.json');
                
                if (response) {
                    this.tests = response;
                    this.inactiveTest();
                }
            } catch (e) {
                console.log(e)
            }
        },
        onFlipCard(card) {
            console.log('onFlipCard', card)
            card.active = !card.active;
        },
        nextSlide() {
            if (this.currentIndex < this.totalSlides - 1) {
                this.currentIndex++;
            }
        },
        prevSlide() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
            }
        },
        inactiveTest() {
            this.tests.forEach(item => item.active = false);
        },
        async restart() {
            await this.inactiveTest();
            this.currentIndex = 0;
        },
        async shuffleSlides() {
            await this.inactiveTest();

            // Простейшая реализация перемешивания
            for (let i = this.tests.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.tests[i], this.tests[j]] = [this.tests[j], this.tests[i]]
            }
            this.currentIndex = 0
        }
    }
})
</script>

<style scoped lang="scss">
.quiz-intro {
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 30px;
    background-color: var(--neutrals1);
    
    ul {
        margin-top: 11px;
        padding-left: 20px;
        list-style: decimal;
        color: var(--neutrals5);
    }
    
    li {
        margin-bottom: 11px;
    }
}

.slider {
    border-radius: 10px;
    padding-bottom: 30px;
    background-color: var(--neutrals1);
    text-align: center;
}

.slider__viewport {
    overflow: hidden;
    width: 100%;
    position: relative;
}

.slider__container {
    /* инлайн-стили задаются через :style */
}

.slider__slide {
    display: flex;
    justify-content: center;
    flex: 0 0 calc(100% / 4);
    min-height: 416px;
    padding-block: 36px;
}

.slider__img {
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 15px;
}

.slider__title {
    margin: 50px 0 10px;
    font-size: 33px;
    font-weight: 600;
}

.slider__author {
    margin-bottom: 48px;
    color: var(--neutrals5);
    font-size: 18px;
    line-height: 145%;
}

.slider__text {
    margin-bottom: 14px;
    font-size: 22px;
    font-weight: 600;
}

.slider__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    padding-inline: 30px;
}

.slider__controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.slider__counter {
    width: 70px;
    font-size: 20px;
    font-weight: 500;
}

.slider__btn {
    min-width: 150px;
    background-color: transparent;
    font-size: 20px;
    font-weight: 500;
    line-height: 145%;
}

.slider__btn-icon {
    line-height: 0;
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}



/* Для правильного расчёта ширины слайда через CSS-переменную */
:root {
    --total-slides: 4; /* Задайте общее число слайдов здесь или динамически через JS */
}


.quiz-card {
    position: absolute;
    height: 344px;
    aspect-ratio: 16/9;
    perspective: 2500px; /* Remove this if you don't want the 3D effect */
    
    @media(max-width: 425px) {
        width: 322px !important;
    }
    
    &__inner {
        position: relative;
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
        transition: transform 0.8s;
        transform-style: preserve-3d;
    }
    
    &__front {
        position: absolute;
        overflow: hidden;
        -webkit-backface-visibility: hidden; /* Safari */
        backface-visibility: hidden;
        height: 100%;
        line-height: 0;
    }
    
    &__back {
        overflow: hidden;
        -webkit-backface-visibility: hidden; /* Safari */
        backface-visibility: hidden;
        width: 100%;
        height: 100%;
        transform: rotateY(180deg);
    }
    
    &_active {
        .quiz-card__inner {
            transform: rotateY(-180deg);
        }
    }
}
</style>
