<template>
    <div class="page-wrapper" :class="{'is-mobile': store.isMobile}">
        <Header v-if="store.isMobile"/>

        <aside class="page-wrapper__aside" :class="{'page-wrapper__aside_mobile': store.isMobile, open: store.isOpenMobileMenu}">
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
import {useStore} from "~/stores/store.js";

export default {
	name: 'default',
    setup() {
        const store = useStore();

        return {
            store
        }
    },
	data() {
		return {
			isScrolled: false
		};
	},
	mounted() {
        console.log('import.meta.client', import.meta.client)
        console.log('process.client', process.client)

        if (process.client) {
            this.store.isMobile = this.$helpers.detectMobile();
            console.log('this.store.isMobile', this.store.isMobile)
        }
		window.addEventListener('scroll', this.handleScroll);
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

            &.open {
                translate: 0;
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
main {
    width: 100%;
	//min-height:calc(100vh - 400px);
}
</style>
