<template>
	<NuxtLink v-if="to && !disabled" :class="classNames" :style="{ width: width }" :to="to" :target="target">
		<div v-if="loading" class="button__spinner"/>
        <slot v-else />
		<div v-if="appendIcon" class="button_append-icon">
			<slot name="append-icon"></slot>
		</div>
	</NuxtLink>
    <button
		v-else
        :class="classNames"
        :style="{ width: width }"
        :disabled="disabled"
        @click="click">
        <div v-if="loading" class="button__spinner"/>
        <span v-else class="button__text">
			<slot/>
		</span>
        <div v-if="appendIcon" class="button_append-icon">
            <slot name="append-icon"></slot>
        </div>
    </button>
</template>
<script>
export default defineNuxtComponent({
    name: 'Button',
    props: {
        loading: {
            type: Boolean,
            default: false,
        },
        click: {
            type: Function,
        },
        width: {
            type: String,
            default: null,
        },
        size: {
            type: String,
            default: 'm',
        },
        color: {
            type: String,
            default: 'normal',
        },
        outlined: {
            type: Boolean,
            default: false,
        },
        text: {
            type: Boolean,
            default: false,
        },
        icon: {
            type: Boolean,
            default: false,
        },
        appendIcon: {
			type: Boolean,
			default: false
		},
        disabled: {
            type: Boolean,
            default: false,
        },
        borderHoverColor: {
            type: String,
            default: null,
        },
		target: {
			type: String,
			default: null,
		},
		to: {
			type: [String, Object],
			default: null
		}
    },

    computed: {
        classNames() {
            return {
				button: true,
                ['button_size_' + this.size]: true,
                ['button_color_' + this.color]: true,
                button_outlined: this.outlined,
                button_icon: this.icon,
                button_text: this.text,
                button_loading: this.loading,
                'button_border-color_hover': this.borderHoverColor,
            };
        },
        isDisabled() {
            return this.loading;
        },
    },
});
</script>
<style lang="scss" scoped>
.button {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
	padding: 0 10px;
    height: 38px;
	border: 1px solid var(--black-color);
	border-radius: 5px;
	background-color: var(--black-color);
	font-family: "Teko", sans-serif;
	font-weight: 500;
	font-size: 15px;
    color: var(--white-color);
    text-decoration: none;
    cursor: pointer;
	transition: background-color .2s linear, border-color .2s linear, color .2s linear;

    &:disabled {
        pointer-events: none;
    }

    &_size {
        &_xs {
            height: 32px;
        }
        &_s {
            height: 35px;
            font-size: 14px;
        }
        &_l {
            height: 143px;
			padding: 0 22px;
			font-size: 16px;
			font-weight: bold;
        }
    }

    &_color {
        &_normal {
            &:disabled {
                opacity: 0.5;
            }
        }

        &_primary {
			&:hover,
			&:focus {
				color: var(--white-color);
				background-color: var(--black-color);
				border-color: var(--black-color);
			}

            &:before {
                content: none;
            }

            //&:hover,
            //&:focus {
            //    background-color: var(--primary2);
            //    border-color: var(--primary2);
            //}

            //&:disabled {
            //    background-color: $primary4;
            //    border-color: $primary4;
            //    color: var(--neutrals2);
            //}
        }

        //&_secondary {
		//	background-color: $LightOrange;
		//	border: 1px solid $LightOrange;
        //
		//	&:hover{
		//		background-color: $HoverOrange;
		//		border-color: $HoverOrange;
		//	}
		//	&:active, &:focus{
		//		background-color: $ActiveOrange;
		//		border-color: $ActiveOrange;
		//	}
        //}

        //&_red {
        //    color: $red-light;
		//	background: $red-light;
        //
        //    &:hover,
        //    &:focus {
        //        color: var(--white-color);
		//		background: var(--white-color);
        //        //border-color: $orange-2;
        //    }
        //
		//	&:hover:before {
		//		background: var(--black-color) !important;
		//	}
        //}
    }

	//&_outlined {
	//	background-color: transparent;
    //
	//	&:hover {
	//		color: $OnLightEggplant;
	//	}
	//	&:active, &:focus {
	//		color: $DarkLightEggplant;
	//	}
    //
	//	&.button_size_xs {
	//		border: 2px solid $BrandOrange;
	//	}
	//}

    &_icon {
        padding-inline: 0;
        width: 40px;
    }

    &_loading {
        text-align: center;
    }

    &-checkbox {
        justify-content: flex-start;

        &.checked {
            color: var(--white-color);
            border-color: var(--primary1);
        }

        &__text {
            margin-left: 8px;
            line-height: 1;
        }
    }

    &__text {
        position: relative;
        z-index: 1;
		display: flex;
		align-items: center;
		gap: 6px;
    }

    &__spinner {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid rgba(255, 255, 255, 0.8);
        border-top: 3px solid rgba(255, 255, 255, 0.1);
        animation: spin 1s linear infinite;
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
