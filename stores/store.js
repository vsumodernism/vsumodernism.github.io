import { defineStore } from 'pinia';
// const isMobileSafari = () => {
// 	return (
// 		/iPhone|iPad|iPod/.test(navigator.userAgent) &&
// 		/Safari/.test(navigator.userAgent) &&
// 		!/CriOS|FxiOS|OPiOS|mercury/.test(navigator.userAgent) // Исключаем другие браузеры
// 	);
// };

export const useStore = defineStore('store', {
	state: () => ({
		isMobile: null,
        isOpenMobileMenu: false,
        isShowedModalGameDemo: false,
	}),
	actions: {
	},
	getters: {
	}
})

