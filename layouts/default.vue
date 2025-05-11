<template>
    <div class="page-wrapper" :class="{'is-mobile': isMobile}">
        <Header v-if="isMobile"/>

        <aside class="page-wrapper__aside" :class="{'page-wrapper__aside_mobile': isMobile}">
            <Menu/>
        </aside>
        <main class="page-wrapper__main">
            <slot/>
        </main>

<!--		<a href="#" class="btn-up" :class="{'btn-up_showed': isScrolled}">-->
<!--			<IconButtonUp/>-->
<!--		</a>-->

	</div>
</template>

<script>
export default {
	name: 'default',
	data() {
		return {
            isMobile: false,
			isScrolled: false,
		};
	},
	mounted() {
        if (import.meta.client) {
            this.isMobile = this.$helpers.detectMobile();
            
            window.addEventListener('scroll', this.handleScroll);
        }
	},
	methods: {
		handleScroll() {
			this.isScrolled = window.scrollY >= window.innerHeight / 2;
		}
	},
};
</script>

<style lang="scss">
.page-wrapper {
    display: flex;

    &__aside {
        max-width: 280px;
        padding: 10px;
        
        &_mobile {
            max-width: none;
            position: fixed;
            top: 65px;
            bottom: 0;
            z-index: 100;
            padding: 0;
            translate: -100%;
            transition: translate .5s;
            
            & :deep(.nav) {
                border-radius: 0;
            }
        }
    }
    
    &__main {
        padding: 50px 36px;
        
        @media (max-width: 425px) {
            padding: 95px 20px 30px;
        }
    }
}

.header-modal-open {
    .page-wrapper__aside {
        translate: 0;
    }
}

main {
    width: 100%;
	//min-height:calc(100vh - 400px);
}
</style>
