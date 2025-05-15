<template>
	<div :class="classNames" :style="{ width: width }">
		<div
			v-if="isMobileBackdrop"
			class="dropdown-backdrop"
			@click="toggleDropdown"
		></div>

		<slot name="input" :onOpen="clickSelect">
			<div class="select__container">
                <div v-if="icon" class="select__icon">
					<slot name="icon"></slot>
				</div>

				<div class="select__input-wrapper" @click="clickSelect">
					<label v-if="label" class="select__label">{{ label }}:</label>
                    <input
						class="select__input"
						:value="inputValue"
						:disabled="disabled"
						placeholder="Choose..."
						readonly
						v-bind="$attrs"
						@input="onInput"
						@change="onInput"
						@blur="blurSelect"
					/>
					<div v-if="numberSelected" class="select__counter">
						{{numberSelected}}
					</div>
					<div
						v-if="clear && inputValue?.length"
						class="select__clear"
						:class="{ 'input__clear_with-append': !!$slots.append }"
						@click.stop="onClear"
					/>
                </div>

				<div v-if="sortOrder" class="select__sort-order-wrapper">
					<i
						class="select__sort-order-icon icon-descending"
						:class="sortOrder === 10 ? 'select__sort-order-icon_asc' : 'select__sort-order-icon-desc'"
						style=""
						title="Descending"
						@click="setSortOrder"
					></i>
				</div>
			</div>
		</slot>

		<div class="select__dropdown" :class="classDropdown">
			<input
				v-if="search && multiselect"
				v-model="searchString"
				class="form-input form-input_inner"
				placeholder="Search..."
				@input="onInput"
				@change="onInput"
			/>

            <div v-if="loading" class="select__loader">
<!--                <LoaderQuad/>-->Loading...
            </div>

            <div class="select__list"
                 ref="selectListRef">
                <div v-if="groupName" class="select-option_group">{{ groupName }}</div>

                <div
                    v-for="item in filteredOptions"
                    :key="item[fieldValue]"
                    class="select-option"
					@click="onClickOption(item)"
                >
<!--					<Checkbox v-if="multiselect" :model-value="item.checked" @click.prevent>-->
<!--                    	{{ item.name }}-->
<!--					</Checkbox>-->

<!--					<template v-else>-->
						{{ item.name }}
<!--					</template>-->
                </div>
            </div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Select',
	props: {
		modelValue: {
			type: [String, Number, Array],
			default: null,
		},
		options: {
			type: [Array, null],
			required: true,
		},
		label: {
			type: String,
			default: '',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
        isLoading: {
			type: Boolean,
			default: false,
		},
		search: {
			type: Boolean,
			default: false,
		},
		searchRequest: {
			type: [Boolean, String],
			default: false,
		},
		scrollLoad: {
			type: Boolean,
			default: false,
		},
		multiselect: {
			type: Boolean,
			default: false,
		},
		multiselectReturn: {
			type: String,
			default: 'fieldValue',
		},
		fieldValue: {
			type: String,
			default: 'id',
		},
		align: {
			type: String,
			default: 'left',
		},
		clear: {
			type: Boolean,
			default: false,
		},
		icon: {
			type: Boolean,
			default: false,
		},
		width: {
			type: String,
			default: null,
		},
		groupName: {
			type: String,
			default: null,
		},
		onAction: {
			type: Function,
		},
		isMobileBackdrop: {
			type: Boolean,
			default: false,
		},
		sortOrder: {
			type: [Number, String],
			default: null,
		}
	},
	data() {
		return {
            selectedOptions: [],
			inputValue: null,
			opened: false,
			focused: false,
			searchString: '',
			selectedValue: null,
			selectListRef: ref(null)
		};
	},
	setup() {
		const { $helpers } = useNuxtApp();

    	return {
			debounce: $helpers.debounce
		};
	},
	computed: {
		filteredOptions() {
            // console.log('filteredOptions')
			let options = [];

			if (this.options.length) {
				options = JSON.parse(JSON.stringify(this.options));

				if (this.search) {
					options = options.filter(item => {
						return item.name.toLowerCase().includes(this.searchString.toLowerCase());
					});
				}

				// options.sort((a, b) => b.checked - a.checked)
			}

			return options;
		},
		numberSelected() {
			return this.selectedOptions.length;
		},
		focus() {
			return this.focused || this.modelValue !== null;
		},
        loading() {
            return this.isLoading && this?.options?.length === 0;
        },
        classNames() {
			return {
				select: true,
				'form-item': true,
				select_icon: this.icon,
				select_focus: this.focus,
				select_opened: this.opened,
				select_clear: this.clear,
				select_multiselect: this.multiselect,
				select_loading: this.loading,
				select_selected: !!this.inputValue?.length,
			};
		},
        classDropdown() {
			return {
				select__dropdown_align_right: this.align === 'right',
			};
		},
	},
	watch: {
		async modelValue(val) {
			// console.log('Select watch:modelValue')
			await this.checkingOptions(this.options);
			await this.fillSelectedOptions(this.options);

			this.generateInputValue(val);
		},
		async options(options) {
            // console.log('Select watch:options', options);

            await this.checkingOptions(options);
            await this.fillSelectedOptions(options);

            this.generateInputValue(this.modelValue);
		},
	},
	async created() {
		// console.log('Select created()', this.modelValue)

        await this.checkingOptions(this.options);
        await this.fillSelectedOptions(this.options);

		this.generateInputValue(this.modelValue);

	},
	async mounted() {
		// console.log('Select mounted()', this.modelValue)

		document.addEventListener('click', this.handleClickOutside);

		if (this.scrollLoad) {
			this.$refs.selectListRef.addEventListener('scroll', this.onScroll);
		}
	},
	methods: {
		onScroll() {
			// console.log('onScroll()')
			const scrollHeight = this.$refs.selectListRef.scrollHeight;
			const scrollTop = this.$refs.selectListRef.scrollTop;
			const clientHeight = this.$refs.selectListRef.clientHeight;
			// console.log('onScroll', scrollHeight, scrollTop + clientHeight, scrollHeight - scrollTop, clientHeight + 50)

			if (scrollHeight - scrollTop < clientHeight + 100) {
				const _this = this;
				this.debounce(function () {
					_this.$emit('scrollLoad');
				}, 100)();
			}
		},
        checkingOptions(options) {
            if (this.multiselect) {
                for (const item of options) {
                    if (this.multiselectReturn === 'fieldValue') {
                        if (this.modelValue.includes(item[this.fieldValue])) {
                            item.checked = true;
                        } else {
                            item.checked = false;
                        }
                    } else {
                        const index = this.modelValue.findIndex(i => i[this.fieldValue] === item[this.fieldValue]);

                        if (index !== -1) {
                            item.checked = true;
                        }
                    }
                }
            } else {
                this.selectedValue = this.modelValue;
            }
        },
        fillSelectedOptions(options) {
			this.selectedOptions = [];

            if (this.multiselect && !this.selectedOptions.length) {
                this.selectedOptions = options.reduce((res, item) => {
                    if (item.checked) {
                        res.push(item);
                    }
                    return res;
                }, []);
				// console.log('this.selectedOptions', this.selectedOptions)
            }
        },
		generateInputValue(val) {
			// console.log('Select generateInputValue()', val, this.selectedOptions)
			if (this.multiselect) {
				this.inputValue = this.selectedOptions
					.filter(item => val.includes(item[this.fieldValue]))
					.map(item => item.name)
					.join(', ');
			} else {
				const res = this.options?.find(item => item[this.fieldValue] === val);

				if (res === undefined) {
					this.inputValue = '';
				} else {
					this.inputValue = res.name;
				}
			}
		},
		// prependIcon(nameIcon) {
		// 	if (nameIcon.prependIcon === 'settings') {
		// 		return Setting;
		// 	} else if (nameIcon.prependIcon === 'logout') {
		// 		return Logout;
		// 	} else if (nameIcon.prependIcon === 'folder-open') {
		// 		return FolderOpen;
		// 	}
		// },
        onClear() {
            if (this.multiselect) {
                for (const item of this.options) {
                    item.checked = false;
                }

                for (const item of this.filteredOptions) {
                    item.checked = false;
                }

                // this.options = [...this.options];
                this.selectedOptions = [];

                // console.log('selectedValues', selectedValues);
                this.$emit('update:modelValue', []);
                this.$emit('change', []);
            } else {
                // this.opened = false;
                // this.searchString = '';
                // this.selectedValue = item[this.fieldValue];
                this.selectedOptions = [];

                this.$emit('update:modelValue', null);
                // this.$emit('change', null);
                // this.$emit('onAction', this.selectedValue);
            }
        },
		onInput(event) {
			// console.log('onInput()', event.target.value, this.selectedValue);
			if (!this.multiselect) {
				this.searchString = event.target.value;
				if (this.selectedValue && event.target.value.toLowerCase() !== this.selectedValue.toLowerCase()) {
					this.selectedValue = null;
				}
			}

			if (this.searchRequest !== false) {
				this.$emit('update:searchRequest', event.target.value);
			}
		},
		setValue(value) {
			this.searchString = value;
		},
		clickSelect(event) {
			event.preventDefault();
			if (this.opened) {
				this.focused = false;
				this.opened = false;
			} else {
				this.focused = true;
				this.opened = true;
				if (event) {
					this.$emit('focus', event.target.value);
				}
			}
		},
		blurSelect(event) {
			setTimeout(() => {
				this.focused = false;

				if (!this.multiselect) {
					this.opened = false;
				}
			}, 100);
		},
		onClickOption(option) {
			// console.log('onClickOption', option);

            if (this.multiselect) {
                let selectedValues = [];

                option.checked = !option.checked;

                const index = this.selectedOptions.findIndex(item => item[this.fieldValue] === option[this.fieldValue]);
                // console.log('index', index)
                // console.log('option', option, index !== -1 && option.checked);

                if (index === -1 && option.checked) {
                    // console.log('add', option)
                    this.selectedOptions.push(option);
                } else if (!option.checked) {
                    // console.log('remove')
                    this.selectedOptions.splice(index, 1)
                }
				// let selectedValues = this.filteredOptions.reduce((res, item) => {
				// 	if (item.checked) {
                //         res.push(item);
				// 	}
				// 	return res;
				// }, []);
                //
                // this.selectedOptions = [...this.selectedOptions, ...selectedValues];
                //
                if (this.multiselectReturn === 'fieldValue') {
                    selectedValues = this.selectedOptions.map(item => item[this.fieldValue]);
                }
				// console.log('selectedValues', selectedValues);
				this.$emit('update:modelValue', selectedValues);
				this.$emit('change', selectedValues);
			} else {
				this.opened = false;
				this.searchString = '';
				this.selectedValue = option[this.fieldValue];
				this.$emit('update:modelValue', this.selectedValue);
				this.$emit('change', this.selectedValue);
				this.$emit('onAction', this.selectedValue);
			}
		},
		handleClickOutside(evt) {
			if (!this.$el.contains(evt.target)) {
				this.opened = false;
				// this.activeItem = -1
			}
		},
		toggleDropdown() {
			this.focused = false;
			this.opened = false;
		},
		setSortOrder() {
			this.$emit('set-sort-order', this.sortOrder === 10 ? 20 : 10);
		}
	},
	destroyed() {
		document.removeEventListener('click', this.handleClickOutside);
		this.$refs.selectListRef.removeEventListener('scroll', this.onScroll);
	},
};
</script>

<style lang="scss" scoped>
.select {
	position: relative;
	display: inline-block;
	font-family: "Teko", sans-serif;
	font-size: 22px;
	letter-spacing: 0.55px;

	&__container {
		position: relative;
		z-index: 1;
		display: flex;
		width: 100%;
	}

	&__icon {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 8px 0 16px;
		height: 100%;
		pointer-events: none;
	}

	&__label {
		height: 44px;
		display: flex;
		align-items: center;
		margin-right: 4px;
		white-space: nowrap;
		pointer-events: none;
	}

	&__input-wrapper {
		position: relative;
		display: flex;
        width: 100%;
		height: 54px;
		padding: 0 40px 0 16px;
		//border: 2px solid #ddd;
		border-radius: 6px;
		background: var(--neutrals1);
		font-weight: 400;
		font-size: 22px;
		font-family: "Teko", sans-serif;
		//color: $Ghost;
		text-overflow: ellipsis;
		transition: border-color 0.2s;
		cursor: pointer;

		&:after {
			content: '';
			position: absolute;
			right: 16px;
			top: 15px;
			display: block;
			width: 24px;
			height: 24px;
			background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M4.77629 8.91768C5.16682 8.52716 5.79998 8.52716 6.19051 8.91768L12.1501 14.8772L18.1096 8.91768C18.5001 8.52716 19.1333 8.52716 19.5238 8.91768C19.9144 9.3082 19.9144 9.94137 19.5238 10.3319L12.8572 16.9986C12.4666 17.3891 11.8335 17.3891 11.443 16.9986L4.77629 10.3319C4.38577 9.94137 4.38577 9.3082 4.77629 8.91768Z' fill='%23818181'/%3E%3C/svg%3E%0A");
			pointer-events: none;
		}
	}

	&__input {
		width: 100%;
		height: 54px;
		//padding: 5px 35px 5px 16px;
		background: transparent;
		font-weight: 400;
		font-size: 15px;
		font-family: "Teko", sans-serif;
		letter-spacing: 0.55px;
		color: var(--black-color);
		text-overflow: ellipsis;
		transition: border-color 0.2s;
		cursor: pointer;

		&::placeholder {
			color: #888;
		}
	}

	&__counter {
		min-width: 24px;
		height: 24px;
		padding-top: 3px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		color: #fff;
		line-height: 1;
		background-color: #B20A66;
		margin-block: auto;
		margin-inline: 5px;
	}

	&__clear {
		width: 50px;
		background-image: url("data:image/svg+xml,%3Csvg stroke='%23818181' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Cpath d='m7 7 18 18'/%3E%3Cpath d='m7 25 18-18'/%3E%3C/g%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: 50% 50%;
		background-size: 24px;
		cursor: pointer;
		transition: filter .2s;

		//&:hover {
		//	filter: brightness(100%) contrast(-100%);
		//}
	}

	&__sort-order {
		&-wrapper {
			position: relative;
			display: inline-flex;
		}

		&-icon {
			box-sizing: border-box;
			width: 4.8rem;
			min-width: 4.8rem;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			font-size: 2.4rem;
			//color: $link-2;
			min-height: 3.2rem;
			//border: 1px solid $dark-2;
			border-left: none;
			//background: $dark-4;
			outline: none;
			//transition: transform .15s linear;

			transition: none 0s ease 0s;
			animation: auto ease 0s 1 normal none running none;


			&_asc {
				transform: scaleY(1);
			}

			&_desc {
				transform: scaleY(-1);
			}
		}
	}

	&_selected {
		.select__input-wrapper {
			background-color: var(--neutrals1);
		}

		.select__input {
			color: #000;
		}
	}
}

.form-input {
	width: 100%;
	height: 54px;
	padding: 5px 35px 5px 16px;
	//border: 2px solid #ddd;
	border-radius: 6px;
	background: var(--neutrals1);
	font-weight: 400;
	font-size: 22px;
	font-family: "Teko", sans-serif;
	letter-spacing: 0.55px;
	//color: $Ghost;
	text-overflow: ellipsis;
	transition: border-color 0.2s;

	&_inner {
		display: block;
		width: calc(100% - 26px);
		height: 40px;
		margin: 13px auto 8px;
		font-size: 18px;

		&::placeholder {
			color: #888;
		}
	}
}

.select .form-input:read-only {
	cursor: pointer;
}

.select__loader {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;

    :deep(.loader) {
        scale: 0.6;
    }
}

.select__dropdown {
	position: absolute;
	top: calc(100% + 8px);
	z-index: 1003;
    display: flex;
    flex-direction: column;
	min-width: 185px;
	width: 100%;
	max-height: 0;
    padding-block: 7px;
	border: 1px solid #ddd;
	border-radius: 6px;
	box-shadow: 0 4px 10px 0 #3939081F, 0 8px 17px 0 #3939081A;
	background: #fff;
	//color: $white;
	//overflow-y: hidden;
	opacity: 0;
	visibility: hidden;
	transition: opacity 0.3s 0.1s, visibility 0s 0.4s, max-height 0.3s;
}

.select__dropdown_align_right {
	right: 0;
}

.select_opened > .select__dropdown {
	overflow-y: auto;
	max-height: 480px;
	opacity: 1;
	visibility: visible;
	transition: opacity 0.3s, visibility 0s, max-height 0.3s;
}

.select__list {
    //color: $white;
    overflow-y: auto;
}

.select_opened > .form-input {
	border-color: #ddd;
}

.select_opened :deep(.arrow),
.select_opened .select__container:after {
	transform: rotate(-180deg);
}

.select_clear .form-input {
	padding-right: 70px;
}

.select_loading .select__list {
    display: none;
}

.select-option {
	position: relative;
	display: flex;
	align-items: center;
	gap: 6px;
	height: 40px;
	padding: 0 25px;
	font-family: "Teko", sans-serif;
	font-size: 15px;
	line-height: 16px;
	cursor: pointer;
	transition: background-color 0.3s;
}

//.select-option__checked {
//	background-color: $dark-2;
//}

//.select-option__checked::after {
//	content: '';
//	position: absolute;
//	right: 16px;
//	top: 26px;
//	display: block;
//	gap: 20px;
//	width: 14px;
//	height: 10px;
//	font-weight: 500;
//}

.select-option:hover {
	//background-color: $dark-2;
}

.select-option__prepend-icon {
	margin-right: 8px;
}

.select-option_group {
	margin-top: 12px;
	color: var(--colorGray);
	font-size: 14px;
	font-weight: 400;
	line-height: 17px;
	text-transform: uppercase;
}

.select_icon .form-input {
	padding-left: 40px;
}

@media (max-width: 375px) {
	.select_opened .dropdown-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1002;
	}
}

//.select_multiselect .select-option::before {
//.select-option::before {
//	content: '';
//	position: static;
//	display: block;
//    flex-shrink: 0;
//    width: 20px;
//	height: 16px;
//	margin-right: 8px;
//	//margin-left: 8px;
//	background-size: contain;
//	background-repeat: no-repeat;
//}

//.select_multiselect .select-option__checked::before {
//.select-option__checked::before {
//	background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='white' d='m173.898 439.404-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0l112.095 112.094 240.095-240.094c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z'/%3E%3C/svg%3E");
//}
</style>
