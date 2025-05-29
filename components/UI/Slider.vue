<template>
	<swiper
		:slides-per-view="1"
		:loop="true"
		:auto-height="true"
		:pagination="{
			clickable: true,
		}"
		:autoplay="{
			delay: 7000,
			disableOnInteraction: false,
			pauseOnMouseEnter: true
		}"
		:modules="modules"
		class="slider-container"
        @swiper="onSwiper"
	>
		<swiper-slide v-for="item in article[isMobile ? 'mobile' : 'desktop']">
			<div class="slider">
                <img class="slider__photo" :src="item.img" :alt="item.alt"/>
			</div>
		</swiper-slide>
    </swiper>
</template>

<script>
import { Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';

import 'swiper/css';
import 'swiper/css/pagination';

export default {
	name: 'Slider',
	components: {
		Swiper,
		SwiperSlide
	},
	props: {
		article: {
			type: Object,
			default: null
		}
	},
	setup() {
		return {
			modules: [Autoplay, Pagination],
		};
	},
    data: () => ({
        isMobile: false,
        swiper: null,
    }),
    mounted() {
        if (import.meta.client) {
            this.isMobile = this.$helpers.detectMobile();
        }
    },
    methods: {
        onSwiper(swiper) {
            this.swiper = swiper;
        },
        prevSlide() {
            this.swiper.slidePrev();
        },
        nextSlide() {
            this.swiper.slideNext();
        }
    },
};
</script>

<style lang="scss" scoped>
.slider-container {
    position: relative;
	overflow: hidden;
    width: calc(100% + 52px);
    margin: -40px -26px 60px -26px;
    aspect-ratio: 1140/191;
    border-radius: 20px;
    
    @media (max-width: 425px) {
        width: calc(100% + 20px);
        margin: -20px -10px 60px -10px;
        aspect-ratio: 370/350;
    }
}

.slider {
    border-radius: 20px;

	&__photo {
        width: 100%;
        aspect-ratio: 1140/191;
        object-fit: cover;
        
        @media (max-width: 425px) {
            aspect-ratio: 370/350;
        }
	}
}


//:deep(.swiper-pagination-bullet) {
//	background-color: #fff;
//	width: 15px;
//	height: 15px;
//	margin: 0 8px !important;
//}
</style>
