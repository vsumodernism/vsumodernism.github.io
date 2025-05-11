<template>
	<header class="header" :class="{ scroll: isScrolled, open: isOpenMobileMenu}">
        <div class="header__burger" @click="menuOpener">
            <IconClose v-if="isOpenMobileMenu"/>
            <IconHamburger v-else/>
        </div>

        <Button to="/">Изучать Артефакты</Button>
	</header>
</template>

<script>
import Button from "~/components/UI/Button.vue";
import IconClose from "~/components/icons/IconClose.vue";
import IconHamburger from "~/components/icons/IconHamburger.vue";

export default {
	name: 'Header',
    components: {
        Button,
        IconClose,
        IconHamburger
    },
	data() {
		return {
			isScrolled: false,
			isOpen: false,
            isOpenMobileMenu: false
		};
	},
	mounted() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const oldClasses = mutation.oldValue?.split(/\s+/) || [];
                    const newClasses = document.body.className.split(/\s+/);
                    
                    if (!oldClasses.includes('header-modal-open') && newClasses.includes('header-modal-open')) {
                        this.isOpenMobileMenu = true
                    } else {
                        this.isOpenMobileMenu = false
                    }
                }
            }
        });
        
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class'],
            attributeOldValue: true,
        });
		window.addEventListener('scroll', this.handleScroll);
	},
	watch: {
		'isOpenMobileMenu'(val) {
			const modals = document.querySelectorAll('.modal-overlay');

			if (val) {
				document.body.classList.add('header-modal-open');
				return;
			}

			if (modals.length < 2) {
				document.body.classList.remove('header-modal-open');
			}
		}
	},
	methods: {
		menuOpener() {
			this.isOpenMobileMenu = !this.isOpenMobileMenu;
		},
		handleScroll() {
			this.isScrolled = window.scrollY >= 50;
		}

	},
};
</script>

<style lang="scss" scoped>
.header {
	position: fixed;
	top: 0;
	z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
	width: 100%;
    height: 65px;
    padding-inline: 20px;
    background-color: var(--neutrals1);
	transition: background-color .2s linear;

//	@media (min-width: 1201px) {
//		&.scroll {
//			display: flex;
//			align-items: center;
//			height: 80px;
//			padding: 0;
//			background-color: rgba($Background, .9);
//			backdrop-filter: blur(5px);
//
//			.header {
//				&__logo {
//					order: -1;
//					//position: absolute;
//					//left: 16px;
//					//top: 0;
//
//					.logo {
//						width: 60px;
//						height: 60px;
//						background-color: $Background;
//
//						:deep(.logo__bg) {
//							width: 94px;
//						}
//
//						:deep(.logo__img) {
//							height: 40px;
//							margin-bottom: 5px;
//						}
//					}
//				}
//
//				&__container {
//					position: relative;
//					justify-content: flex-start;
//					gap: 16px;
//					//padding-bottom: 14px;
//				}
//
//				&-controls {
//					flex-grow: 1;
//				}
//			}
//
//			.nav {
//				margin-left: 16px;
//				width: auto;
//
//				&__list {
//
//				}
//			}
//		}
//	}
//
//	@media (max-width: var(--laptopL)) {
//		padding-top: 79px;
//
//		&.open{
//			background-color: $Background;
//			height: 100dvh;
//			overflow: auto;
//
//			.nav, .nav__list, .header-controls{
//				display: flex;
//				flex-direction: column;
//				width: 100%;
//				min-width: 100%;
//			}
//		}
//	}
//
//	&__logo {
//		color: $BrandOrange;
//		line-height: 0;
//		&-img{
//			display: none;
//		}
//		@media (max-width: var(--laptopL)) {
//			position: fixed;
//			left: 16px;
//			top: 14px;
//			.logo{
//				display: none;
//			}
//			&-img{
//				display: inline-block;
//				height: 44px;
//			}
//		}
//	}
//
//	&__container {
//		display: flex;
//		justify-content: space-between;
//		align-items: center;
//		gap: 2rem;
//		margin-inline: auto;
//		@media (max-width: var(--laptopL)) {
//			flex-direction: column;
//			max-width: 450px;
//			gap: 0;
//		}
//
//	}
//
//	&__burger {
//		color: var(--white-color);
//		display: none;
//
//		@media (max-width: var(--laptopL)) {
//			display: inline-block;
//			position: fixed;
//			right: 16px;
//			top: 20px;
//			fill: $BrandOrange;
//			width: 32px;
//			height: 32px;
//			z-index: 9;
//		}
//	}
//
//	&-btn {
//		position: relative;
//		display: inline-flex;
//		align-items: center;
//		white-space: nowrap;
//		box-sizing: border-box;
//		font-family: $secondary-text;
//		font-size: 22px;
//		height: 32px;
//		letter-spacing: .55px;
//		color: $Primary;
//		line-height: 1;
//		padding: 2px 18px 0;
//		border-radius: 27px;
//		border: 2px solid $BrandOrange;
//		cursor: pointer;
//		overflow: hidden;
//
//		&:hover:before {
//			top: -6px
//		}
//
//		&::before {
//			content: '';
//			display: inline-block;
//			width: 100%;
//			min-width: 113px;
//			height: 44px;
//			position: absolute;
//			top: -44px;
//			left: 0;
//			background-position: bottom left;
//			background-size: cover;
//			background-image: url("data:image/svg+xml,%3Csvg width='113' height='44' viewBox='0 0 113 44' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.15306 5.36987L0 6.21943V37.7806L1.15306 38.6301C2.30612 39.4797 4.61224 41.1788 6.91837 42.2711C9.51276 43.3634 11.8189 43.8488 14.125 43.7275C16.0468 43.6263 17.9685 43.1038 19.8903 42.5812C20.2747 42.4767 20.659 42.3722 21.0434 42.2711C23.6378 41.6643 25.9439 41.1788 28.25 40.8147C30.556 40.4506 32.8621 40.2079 35.1681 39.9652C35.279 39.9548 35.3897 39.9444 35.4995 39.9341C37.9599 39.7028 40.1675 39.4953 42.375 39.8438C43.6562 40.0461 44.9374 40.4356 46.2185 40.8252C47.2435 41.1368 48.2684 41.4485 49.2934 41.6643C51.8878 42.1497 54.1939 42.1497 56.5 41.7856C57.1289 41.6863 57.7579 41.5599 58.3868 41.4336C60.064 41.0965 61.7412 40.7595 63.4184 40.9361C65.2086 41.1036 66.8616 41.7334 68.472 42.347C69.1954 42.6226 69.9102 42.8949 70.625 43.1206C72.9311 43.8488 75.2372 44.0916 77.5434 43.9702C80.1378 43.8488 82.4439 43.3634 84.75 42.3925C85.5187 42.0688 86.2874 41.6912 87.0561 41.3136C88.5935 40.5585 90.131 39.8033 91.6684 39.4797C94.2628 38.9942 96.5689 39.4797 98.875 40.0865C99.1056 40.1472 99.3363 40.2091 99.5669 40.271C101.642 40.8281 103.718 41.3851 105.793 41.0574C107.528 40.814 109.133 40.0825 110.696 39.3705C111.471 39.0174 112.235 38.669 113 38.3874V5.6126C112.235 5.33096 111.471 4.98262 110.696 4.6295C109.133 3.91746 107.528 3.18596 105.793 2.94257C103.718 2.61488 101.642 3.17194 99.5668 3.72901C99.3362 3.79091 99.1056 3.8528 98.875 3.91349C96.5689 4.52031 94.2628 5.00577 91.6684 4.52031C90.131 4.19667 88.5936 3.44152 87.0561 2.68636C86.2874 2.30877 85.5187 1.93119 84.75 1.60755C82.4439 0.636628 80.1378 0.151167 77.5434 0.0298016C75.2372 -0.0915636 72.9311 0.151167 70.625 0.879358C69.9102 1.10507 69.1954 1.37742 68.472 1.65304C66.8616 2.26663 65.2086 2.89644 63.4184 3.06393C61.7412 3.24046 60.064 2.90345 58.3868 2.56643C57.7579 2.44005 57.1289 2.31367 56.5 2.21438C54.1939 1.85028 51.8878 1.85028 49.2934 2.33574C48.2684 2.5515 47.2435 2.86315 46.2185 3.17481C44.9374 3.56438 43.6562 3.95394 42.375 4.15622C40.1675 4.50475 37.9599 4.29723 35.4995 4.06593C35.3897 4.05561 35.2793 4.04523 35.1684 4.03485C32.8622 3.79212 30.5561 3.54939 28.25 3.1853C25.9439 2.8212 23.6378 2.33574 21.0434 1.72891C20.659 1.62778 20.2747 1.52327 19.8903 1.41876C17.9685 0.896214 16.0468 0.37367 14.125 0.272532C11.8189 0.151167 9.51276 0.636628 6.91837 1.72891C4.61225 2.8212 2.30612 4.52031 1.15306 5.36987Z' fill='%23E38062' /%3E%3C/svg%3E");
//			transition: top .3s linear;
//		}
//		@media (max-width: var(--laptopL)) {
//			width: 100%;
//			height: auto;
//			padding: 20px;
//			border: none;
//			border-radius: 0;
//			border-bottom: 1px solid $BorderEggplant;
//			&:before{
//				display: none;
//			}
//		}
//
//		&__inner {
//			position: relative;
//		}
//	}
//
//	&-link{
//		display: inline-flex;
//		align-items: baseline;
//		white-space: nowrap;
//		font-family: Teko, sans-serif;
//		font-size: 22px;
//		letter-spacing: .55px;
//		color: $Primary;
//		line-height: 1;
//		cursor: pointer;
//		gap: 4px;
//		transition: color .15s linear, fill .15s linear;
//		fill: $Primary;
//		@media (max-width: var(--laptopL)) {
//			width: 100%;
//			height: auto;
//			padding: 20px 0;
//			border: none;
//			border-bottom: 1px solid $BorderEggplant;
//		}
//
//		svg{
//			width: 20px;
//			height: 20px;
//			min-width: 20px;
//			transform: translateY(3px);
//		}
//
//		&:hover{
//			color: $HoverOrange;
//			fill: $HoverOrange;
//		}
//	}
//
//	&-controls {
//		display: inline-flex;
//		//justify-content: flex-end;
//		gap: 16px;
//		//min-width: 432px;
//		width: calc(1408px/2 - 63px - 2rem - 16px);
//		align-items: center;
//
//		@media (max-width: var(--laptopL)) {
//			min-width: 100%;
//			width: 100%;
//			display: none;
//			align-items: stretch;
//			gap: 0;
//		}
//	}
//
//	&__up {
//		margin-left: auto;
//
//		@media (max-width: var(--laptopL)) {
//			margin-left: initial;
//			order: initial;
//		}
//	}
//}
//
//.nav {
//	//min-width: 432px;
//	width: calc(1408px/2 - 63px - 2rem - 16px);
//	text-align: right;
//
//	@media (max-width: var(--laptopL)) {
//		display: none;
//	}
//
//	&__item {
//		position: relative;
//
//		&:hover {
//			.nav__sublist {
//				visibility: visible;
//			}
//		}
//	}
//
//	&__list {
//		display: inline-flex;
//		gap: 16px;
//
//		@media (max-width: var(--laptopL)) {
//			gap: 0;
//		}
//	}
//
//	&__sublist {
//		position: absolute;
//		top: calc(100% + 10px);
//		left: 1px;
//		visibility: hidden;
//		min-width: 150px;
//		padding: 8px;
//		border: 1px solid $LightEggplant;
//		border-radius: 16px;
//		background-color: $Surface;
//		font-family: $secondary-text;
//		font-size: 20px;
//		transition: visibility .2s;
//
//		@media (max-width: var(--laptopL)) {
//			position: static;
//			visibility: visible;
//			background-color: transparent;
//			border: 0;
//			border-radius: 0;
//			padding-left: 30px;
//			border-bottom: 1px solid $BorderEggplant;
//		}
//	}
//
//	&__sublist-link {
//		display: block;
//		padding-inline: 12px;
//		border-radius: 4px;
//		line-height: 40px;
//		color: $Primary;
//
//		&:hover, &:active {
//			background-color: $Additional;
//		}
//	}

}


</style>
