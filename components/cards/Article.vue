<script>
import {defineComponent} from 'vue'
import Zooming from "zooming";

export default defineComponent({
    name: "Article",
    props: {
        article: {
            type: Array,
            default: []
        }
    },
    watch: {
        article(newValue) {
            if (newValue.length) {
                console.log('Zooming')
                this.$nextTick(() => {
                    new Zooming({
                        bgColor: '#313131',
                        scaleBase: 0.8,
                    }).listen('.article-picture__img');
                })
                // setTimeout(() => {
                //     new Zooming().listen('.article-picture__img');
                // })
            }
        }
    },
    methods: {
        parseIntroList(list) {
            return list.map(item => {
                if (typeof item === 'string') {
                    return item
                } else {
                    return `<a href="${item.link}">${item.title}</a>`
                }
            }).join(', ')
        },
        viewClass(countPictures) {
            const obj = {};
            
            obj[`gallery-row_${countPictures}`] = true
            
            return obj
        },
        viewClassPeriod(countPictures) {
            const obj = {};
            
            obj[`period__pictures_${countPictures}`] = true
            
            return obj
        }
    }
})
</script>

<template>
    <article v-if="article?.length" class="article">
        <template v-for="block in article">
            
            <div v-if="block.view === 'intro'" class="article-intro">
                <img v-if="block?.avatar" :src="block.avatar" class="article-intro__avatar"/>
                <h1 v-if="block?.title" class="title_size_40 mb-15">{{block.title}}</h1>
                <div v-if="block?.dates" class="text-gray mb-15">{{block.dates}}</div>
                
                <template v-for="item in block?.content">
                    <p v-if="typeof item === 'string'" v-html="item"></p>
                    
                    <div v-else-if="typeof item === 'object'">
                        <img :src="item.img" class="article-picture__img" alt=""/>
                        <div v-html="item.description"></div>
                    </div>
                </template>

                <ul v-if="block?.tags?.length" class="article-intro__tags">
                    <li v-for="tag in block.tags" class="article-intro__tag">{{tag}}</li>
                </ul>
                
                <div v-if="block?.list" class="article-intro__list">
                    <span class="article-intro__list-title">{{block.list.title}}: </span>
                    <span v-html="parseIntroList(block.list.content)"/>
                </div>
                
                <template v-if="block?.authors">
                    <div class="article-intro__authors-title">{{block?.authors.title}}</div>
                    <div class="article-intro__authors">
                        <div v-for="author in block.authors.items" class="article-author">
                            <img :src="author.avatar" class="article-author__avatar" alt=""/>
                            <div class="article-author__content">
                                <span class="article-author__name">{{author.name}}</span>
                                <span class="article-author__description" v-html="author.description"></span>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            
            <blockquote v-else-if="block.view === 'quote'" v-html="block.content"></blockquote>
            
            <div v-else-if="block.view === 'image'" class="article-picture mb-40">
                <img :src="block.img" class="article-picture__img" alt=""/>
                <div class="article-picture__description">{{block.description}}</div>
            </div>
            
            <template v-else-if="block.view === 'text'">
                <h2 v-if="block.title" class="mb-10">{{block.title}}</h2>
                
                <template v-for="item in block.content">
                    <p v-if="typeof item === 'string'" v-html="item"></p>
                    
                    <ul v-else-if="Array.isArray(item)" class="article-list article-list_disc">
                        <li v-for="li in item" class="" v-html="li"></li>
                    </ul>

                    <div v-else-if="typeof item === 'object'" class="article-picture">
                        <img :src="item.img" class="article-picture__img" alt=""/>
                        <div class="article-picture__description" v-html="item.description"></div>
                    </div>
                </template>
            </template>
            
            <h2 v-else-if="block.view === 'headline'" class="title_size_25 mt-40 mb-40">{{block.title}}</h2>
            
            <div v-else-if="block.view === 'period'" class="period">
                <h3 class="period__title">{{block.title}}</h3>
                
                <template v-for="item in block.content">
                    <p v-if="typeof item === 'string'" v-html="item"></p>
                    
                    <div v-else-if="typeof item === 'object'">
                        <img :src="item.img" alt=""/>
                        <div v-html="item.description"></div>
                    </div>
                </template>
                
                <div v-if="block?.list?.length" class="period__list">
                    <p v-for="item in block.list">
                        <b>{{item.title}}: </b>
                        <span v-html="item.content"/>
                    </p>
                </div>
                
                <div v-if="block?.pictures?.length" class="period__pictures" :class="viewClassPeriod(block.pictures.length)">
                    <div v-for="picture in block.pictures" class="picture">
                        <div class="picture__cover"
                             :class="{'picture__cover_fields': picture.view === 'fields'}"
                             :style="picture?.bg ? `background-color: #${picture.bg}` : null">
                            <img :src="picture.img" class="picture__img"/>
                            <div v-if="picture.style" class="picture__style">{{picture.style}}</div>
                        </div>
                        <span class="picture__name">«{{picture.name}}»</span>
                    </div>
                </div>
            </div>
            
            <div v-else-if="block.view === 'gallery'" class="gallery">
                <div v-for="row in block.pictures" class="gallery-row" :class="viewClass(row.length)">
                    <div v-for="picture in row" class="picture">
                        <div class="picture__cover"
                             :class="{'picture__cover_fields': picture.view === 'fields'}"
                             :style="picture?.bg ? `background-color: #${picture.bg}` : null">
                            <img :src="picture.img" class="picture__img"/>
                            <div v-if="picture.style" class="picture__style">{{picture.style}}</div>
                        </div>
                        <h3 class="picture__name">«{{picture.name}}»</h3>
                    </div>
                </div>
            </div>
            
            <ul v-else-if="['list-bold', 'list-thin'].includes(block.view)" class="article-list" :class="{'article-list_thin': block.view === 'list-thin'}">
                <li v-for="item in block.list" class="article-list__item" v-html="item"></li>
            </ul>
            
            <div v-else-if="block.view === 'video'" class="video">
                <iframe class="video__src" :src="`https://www.youtube.com/embed/${block.video_id}`" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                <span class="video__description">«{{block.description}}»</span>
            </div>
        </template>
    </article>
</template>

<style scoped lang="scss">
.gallery {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.gallery-row {
    display: flex;
    gap: 20px;
    
    @media (max-width: 425px) {
        flex-direction: column;
    }
    
    &_1 {
        .picture__cover {
            aspect-ratio: 780/432;
        }
    }
    
    &_2 {
        .picture__cover {
            aspect-ratio: 380/411;
        }
    }
    
    &_3 {
        .picture__cover {
            aspect-ratio: 380/411;
        }
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
}
</style>