<template>
    <div>
        <h1 class="title_size_40 mb-15">Галерея</h1>
        <p class="text-gray mb-30">{{countPictures}} произведений</p>
        
        <div class="tools">
            <Input v-model="search" placeholder="Поиск по названию...">
                <template #prepend>
                    <IconSearch/>
                </template>
            </Input>

            <Select v-model="author" :options="authors" search clear placeholder="Поиск по автору" />
            
            <Select v-model="style" :options="styles" clear placeholder="Поиск по стилю" />
        </div>
        
        <template v-if="search.length || author || style">
            <div v-if="filteredPictures.length" class="gallery-grid mt-40">
                <div v-for="picture in filteredPictures" class="picture" :key="picture.name+picture.author">
                    <div class="picture__cover"
                         :class="{'picture__cover_fields': picture.view === 'fields'}"
                         :style="picture?.bg ? `background-color: #${picture.bg}` : null">
                        <img :src="picture.img" class="picture__img"/>
                        <div class="picture__style">{{picture.style}}</div>
                    </div>
                    <h3 class="picture__name">«{{picture.name}}»</h3>
                    <p class="picture__author">{{picture.author}}</p>
                </div>
            </div>
            <div class="empty-result">
                Не найдены произведения
            </div>
        </template>

        <div v-else-if="galleries.length" class="gallery mt-40">
            <div v-for="row in galleries" class="gallery-row" :class="viewClass(row.view)">
                <div v-for="picture in row.pictures" class="picture">
                    <div class="picture__cover"
                         :class="{'picture__cover_fields': picture.view === 'fields'}"
                         :style="picture?.bg ? `background-color: #${picture.bg}` : null">
                        <img :src="picture.img" class="picture__img"/>
                        <div class="picture__style">{{picture.style}}</div>
                    </div>
                    <h3 class="picture__name">«{{picture.name}}»</h3>
                    <p class="picture__author">{{picture.author}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Zooming from 'zooming';
import Input from '~/components/UI/Input.vue'
import Select from '~/components/UI/Select.vue'
import IconSearch from '~/components/icons/IconSearch.vue'

export default defineNuxtComponent({
    name: 'PageGallery',
    components: {
        Input,
        Select,
        IconSearch
    },
    async setup() {
        let galleries = [];
        
        try {
            const response = await $fetch('/data/gallery.json');

            if (response) {
                galleries = response;
            }
        } catch (e) {
            console.log(e)
        }
        
        // useSeoMeta({
        // 	title: t('pages.games.title'),
        // 	ogTitle: t('pages.games.title'),
        // 	author: t('pages.games.description'),
        // 	ogDescription: t('pages.games.description'),
        // 	ogImage: $config.public.OG_DEFAULT_IMAGE,
        // 	robots: 'index, follow'
        // });
        
        return {
            galleries
        }
    },
    data() {
        return {
            search: '',
            author: '',
            style: '',
            authors: [],
            styles: [],
            pictures: [],
        }
    },
    computed: {
        countPictures() {
            return this.galleries.reduce((sum, item) => {
                return sum + item?.pictures?.length
            }, 0)
        },
        filteredPictures() {
            const search = this.search ? this.search.toLowerCase() : null;
            const author = this.author ? this.author.toLowerCase() : null;
            const style = this.style ? this.style.toLowerCase() : null;
            
            if (!search && !author && !style) {
                return [];
            }

            return this.pictures.filter(picture => {
                const okName   = search  ? picture.name.toLowerCase().includes(search)     : true;
                const okAuthor = author  ? picture.author.toLowerCase().includes(author)   : true;
                const okStyle  = style   ? picture.style.toLowerCase().includes(style)     : true;
                
                return okName && okAuthor && okStyle;
            })
        }
    },
    mounted() {
        new Zooming().listen('.picture__img')
        
        const pictures = [];
        const authors = [];
        const styles = [];

        this.galleries.forEach(row => pictures.push(...row.pictures))

        pictures.forEach(picture => {
            if (!authors.includes(picture.author)) {
                authors.push(picture.author)
            }

            if (!styles.includes(picture.style)) {
                styles.push(picture.style)
            }
        })
        
        this.pictures = pictures;
        this.authors = authors.map(item => {
            return {id: item, name: item}
        });
        
        this.styles = styles.map(item => {
            return {id: item, name: item}
        });
    },
    methods: {
        viewClass(view) {
            let obj = {}
            
            switch (view) {
                case '2': obj['gallery-row_2'] = true; break
                case '2sb': obj['gallery-row_2sb'] = true; break
                case '2bs': obj['gallery-row_2bs'] = true; break
            }

            return obj
        }
    }
})
</script>

<style scoped lang="scss">
.tools {
    width: 100%;
    display: flex;
    gap: 20px;
    
    :deep(.input) {
        width: 300px;
    }

    :deep(.select) {
        width: 300px;
    }
}
.empty-result {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    font-size: 18px;
    color: var(--neutrals4);
}

.gallery {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.gallery-grid {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    
    .picture {
        max-width: 350px;
    }
}

.picture {
    width: 100%;
    
    &__cover {
        position: relative;
        aspect-ratio: 348/411;
        margin-bottom: 15px;
        border-radius: 15px;
        line-height: 0;
        
        &_fields {
            padding: 15px;
            background-color: var(--black-color);
            
            .picture__img {
                object-fit: contain;
            }
        }
    }

    &__img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        border-radius: 15px;
    }
    
    &__style {
        position: absolute;
        left: 15px;
        bottom: 15px;
        z-index: 1;
        padding: 5px;
        border-radius: 4px;
        backdrop-filter: blur(15px);
        background-color: rgba(237, 237, 237, 0.5);
        line-height: normal;
    }
    
    &__name {
        font-size: 17px;
        margin-bottom: 5px;
    }
    
    &__author {
        color: var(--neutrals4);
    }
}

.gallery-row {
    display: flex;
    gap: 20px;
    //max-height: 470px;

    @media (max-width: 425px) {
        flex-direction: column;
    }
    
    &_2 {
        .picture__cover {
            aspect-ratio: 532/411;
        }
    }

    &_2bs {
        .picture:nth-child(1) {
            flex: 2 1 0;
            
            & > .picture__cover {
                aspect-ratio: 696/411;
            }
        }
        .picture:nth-child(2) {
            flex: 1 1 0;
        }
    }

    &_2sb {
        .picture:nth-child(1) {
            flex: 1 1 0;
        }
        .picture:nth-child(2) {
            flex: 2 1 0;
            
            & > .picture__cover {
                aspect-ratio: 696/411;
            }
        }
    }
}
</style>
