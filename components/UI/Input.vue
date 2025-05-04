<template>
    <div :class="classNames" :style="{ width: width }">
        <label v-if="label">{{ label }}</label>
        <div class="form-item__content" :class="{'form-item__content_append': !!$slots.append, 'form-item__content_prepend': !!$slots.prepend}">
            <div v-if="!!$slots.prepend" class="input__prepend">
                <slot name="prepend" />
            </div>
            
            <textarea
                v-if="typeValue === 'textarea'"
                ref="textarea"
                class="input"
                :value="inputValue"
                :disabled="disabled"
                :placeholder="placeholder"
                :readonly="readonly"
                @input="onInput"
                @change="onInput"
                @blur="onBlur"
                @focus="onFocus"></textarea>
            <input
                v-else
                class="input"
                :class="classNamesInput"
                :type="typeValue"
                :value="inputValue"
                :disabled="disabled"
                :placeholder="placeholder"
                :readonly="readonly"
                :min="min"
                :max="max"
                @input="onInput"
                @change="onInput"
                @blur="onBlur"
                @focus="onFocus"/>

            <div v-if="clear && inputValue?.length" class="input__clear" :class="{'input__clear_with-append': !!$slots.append}" @click.stop="onClear"></div>

            <template v-if="type === 'number'">
                <div class="input__up" @click="up"></div>
                <div class="input__down" @click="down"></div>
            </template>

			<div v-if="!!$slots.append" class="input__append">
            	<slot name="append" />
			</div>
        </div>
<!--        <div v-if="type === 'password'" class="icon-password" @click="showPassword = !showPassword">-->
<!--            <IconEyeClose v-if="typeValue === 'password'"/>-->
<!--            <IconEyeOpen v-else/>-->
<!--        </div>-->
        <template v-if="!hideComment">
            <p v-if="showedMsgError || !comment" class="form-item__error-message">
                {{ showedMsgError }}
            </p>
            <p v-if="comment && !showedMsgError" class="form-input_comment">{{ comment }}</p>
        </template>
    </div>
</template>

<script>
export default {
    name: 'Input',
    props: {
        modelValue: {
            type: [String, Number],
            default: '',
        },
        type: {
            type: String,
            default: 'text',
        },
        name: {
            type: String,
            default: null,
        },
        label: {
            type: String,
            default: '',
        },
        width: {
            type: String,
            default: null,
        },
        comment: {
            type: String,
            default: null,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        error: {
            type: String,
            default: null,
        },
        hideComment: {
            type: Boolean,
            default: false,
        },
        textareaMaxHeight: {
            type: Number,
            default: 48 * 4
        },
        min: {
            type: Number,
            default: 1,
        },
        max: {
            type: Number,
            default: null,
        },
        buttonsNumber: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: '',
        },
        readonly: {
            type: Boolean,
            default: false
        },
        clear: {
            type: Boolean,
            default: false
        },
        stylisation: {
            type: String,
            default: null
        },
        theme: {
            type: String,
            default: null
        },
        rules: {
            type: Array,
            default: null,
        },
    },
    inject: {
        registerInput: {
            default: () => {
                return () => {}
            }
        },
        registerInputValidation: {
            default: () => {
                return () => {}
            }
        },
    },
    data() {
        return {
            focused: false,
            showPassword: false,
            response: {},
            msgError: null,
        };
    },
    computed: {
        inputValue() {
            return this.modelValue;
        },
        typeValue() {
            return this.showPassword ? 'text' : this.type;
        },
        focus() {
            return this.focused || !(this.modelValue === null || this.modelValue === '');
        },
        showedMsgError() {
            return this.error || this.msgError;
        },
        classNames() {
            return {
                'form-item': true,
                'form-item_focus': this.focus,
                'form-item_type_number': this.buttonsNumber,
                'form-item_stylisation_vuetify': this.stylisation === 'vuetify',
                'form-item_theme_dark': this.theme === 'dark',
            };
        },
        classNamesInput() {
            const obj = {};

            if (!!this.$slots.append && this.clear) {
                obj['input_append-2-icons'] = true;
            } else if (!!this.$slots.append || this.clear) {
                obj['input_append-1-icon'] = true;
            }

            return obj;
        },
    },
    created() {
        if (this.rules?.length) {
            let parent = this.$parent;

            while (parent && parent.$options.name !== 'Form') {
                parent = parent.$parent;
            }
            if (parent) {
                this.index = parent.inputValidationStates.length;
                parent.inputValidationStates.push(false);
                parent.registerInput(this);
            }
        }
    },
    mounted() {
        // this.focused = !!this.value
        if (this.type === 'textarea') {
            this.$nextTick(() => {
                this.$refs.textarea.style.height = `${this.$refs.textarea.scrollHeight}px`;
            });
        }
    },
    methods: {
        up() {
            this.$emit('update:modelValue', this.inputValue + 1);
        },
        down() {
            if (this.inputValue > 1) {
                this.$emit('update:modelValue', this.inputValue - 1);
            }
        },
        onClear() {
            this.$emit('update:modelValue', '');
        },
        onInput(event) {
            switch (this.type) {
                case 'textarea':
					event.target.style.height = 'auto';

                    if (this.textareaMaxHeight < event.target.scrollHeight) {
                        event.target.style.height = `${this.textareaMaxHeight}px`;
                    } else {
                        event.target.style.height = `${event.target.scrollHeight}px`;
                    }
                    break;
            }

            // if (this.min && this.min > event.target.value) {
            //     return;
            // }
            //
            // if (this.max && event.target.value > this.max) {
            //     return;
            // }
            //
            this.$emit('update:modelValue', event.target.value);

            this.$nextTick(() => {
                this.validate();
            });
        },
        onBlur(event) {
            this.focused = !!event.target.value;
            this.validate();
            this.$emit('blur', event.target.value);
        },
        onFocus(event) {
            this.focused = true;
            if (event) {
                this.$emit('focus', event.target.value);
            }
        },
        validate() {
            // console.debug('input.validate()', this.modelValue)
            if (this.disabled) {
                if (this.registerInputValidation) {
                    this.registerInputValidation(this.index, true);
                }
            }

            if (this.rules?.length && !this.disabled) {
                for (const func of this.rules) {
                    const msg = func(this.modelValue);
                    // console.log('msg', msg);

                    if (msg?.length) {
                        this.msgError = msg;

                        if (this.registerInputValidation) {
                            this.registerInputValidation(this.index, false);
                        }

                        this.$emit('update:valid', false);
                        break;
                    } else {
                        this.msgError = null;

                        if (this.registerInputValidation) {
                            this.registerInputValidation(this.index, true);
                        }

                        this.$emit('update:valid', true);
                    }
                }
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.form-item {
    position: relative;

    &__content {
        position: relative;
        z-index: 0;

        &_prepend {
            display: flex;
            
            .input {
                padding-left: 50px;
            }
        }

        &_append {
            display: flex;

            .input {
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }

            :deep(.button) {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
        }
    }

    &__error-message {
        font-size: 13px;
        font-weight: 400;
        line-height: 22px;
        color: var(--red-color);
    }

    &_type_number {
        .input__up {
            position: absolute;
            top: 0;
            right: 0;
            z-index: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            content: '';
            width: 36px;
            height: 20px;
            border-top-right-radius: 8px;
            font-size: 12px;
            background-color: var(--primary1);
            background-image: url("data:image/svg+xml,%3Csvg enable-background='new 0 0 512 512' width='20' height='20' viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23ffffff' d='m413.1 327.3-1.8-2.1-136-156.5c-4.6-5.3-11.5-8.6-19.2-8.6s-14.6 3.4-19.2 8.6l-135.9 156.2-2.3 2.6c-1.7 2.5-2.7 5.5-2.7 8.7 0 8.7 7.4 15.8 16.6 15.8h286.8c9.2 0 16.6-7.1 16.6-15.8 0-3.3-1.1-6.4-2.9-8.9z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: 50% 50%;
            color: var(--white-color);
            cursor: pointer;
        }
        .input__down {
            position: absolute;
            right: 0;
            bottom: 0;
            z-index: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            content: '';
            width: 36px;
            height: 20px;
            border-bottom-right-radius: 8px;
            font-size: 12px;
            background-color: var(--primary1);
            background-image: url("data:image/svg+xml,%3Csvg enable-background='new 0 0 512 512' width='20' height='20' viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23ffffff' d='m98.9 184.7 1.8 2.1 136 156.5c4.6 5.3 11.5 8.6 19.2 8.6s14.6-3.4 19.2-8.6l135.9-156.2 2.3-2.6c1.7-2.5 2.7-5.5 2.7-8.7 0-8.7-7.4-15.8-16.6-15.8h-286.8c-9.2 0-16.6 7.1-16.6 15.8 0 3.3 1.1 6.4 2.9 8.9z'/%3E%3C/svg%3E%0A");
            background-repeat: no-repeat;
            background-position: 50% 50%;
            color: var(--white-color);
            cursor: pointer;
        }

        .input__up:hover,
        .input__down:hover {
            background-color: var(--primary2);
        }
    }

    &_stylisation_vuetify {
        height: 65px;

        label {
            position: absolute;
            translate: 0 12px;
            z-index: 1;
            color: var(--neutrals4);
            transition: translate .25s, font-size .25s;
            pointer-events: none;
        }
        .input {
            height: 43px;
            padding: 10px 0 0 0;
            border: 0;
            border-bottom: 1px solid var(--neutrals3);
        }

        &.form-item_focus {
            label {
                font-size: 10px;
                translate: 0 -3px;
            }
        }
    }

    &_theme_dark {
        label {
            color: var(--white-color);
        }

        .input {
            color: var(--white-color);
        }
    }
}


label {
	display: block;
	font-family: "Noto Sans", sans-serif;
	font-weight: 700;
	font-size: 16px;
	line-height: 1.5;
	margin-bottom: 5px;
}

.input {
	position: relative;
    width: 100%;
	height: 54px;
	padding: 5px 35px 5px 16px;
	//border: 2px solid $BorderGray;
	border-radius: 6px;
	background-color: var(--neutrals1);
	//color: $white;
	font-weight: 400;
	font-size: 15px;
	line-height: 1.5;
	letter-spacing: 0.55px;
    transition: border-color 0.15s linear;

    &_append-1-icon {
        padding-right: 45px;
    }

    &_append-2-icons {
        padding-right: 75px;
    }

    &__clear {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        width: 50px;
        background-image: url("data:image/svg+xml,%3Csvg stroke='%2362798b' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Cpath d='m7 7 18 18'/%3E%3Cpath d='m7 25 18-18'/%3E%3C/g%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: 50% 50%;
        background-size: 24px;
        cursor: pointer;
        transition: filter .2s;

        &_with-append {
            right: 40px;
            width: 30px;
        }

        &:hover {
            filter: brightness(400%);
        }
    }

    &__prepend {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
        z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50px;
	}

    &__append {
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50px;
	}

	&::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
    }

    &:disabled {
        opacity: 0.5;
        pointer-events: none;

        //&:hover,
        &:focus {
            //border-color: rgba($black, .62);
        }
    }

	&:focus, &:active {
		//border-color: $LightEggplant;
		//background-color: $OnLightOrange;
	}

    &::placeholder {
        color: var(--neutrals4);
    }
}

.checkbox {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    //background-color: $dark-4;
    //border: 2px solid $dark-3;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.15s linear, border-color 0.15s linear;

    &:disabled {
        pointer-events: none;
    }

    &__indicator {
        position: absolute;
        top: calc(50% - 1px);
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.15s linear;

        &.checked {
            opacity: 1;
        }
    }

    &.checked {
        //background-color: $primary1;
        //border-color: $primary1;
    }

    input[type="checkbox"] {
        display: none;
    }
}

.icon {
	width: 30px;
}

.icon-password {
    position: absolute;
    top: 45px;
    right: 20px;
    display: flex;
    width: 16px;
    height: 16px;
    cursor: pointer;
}
</style>
