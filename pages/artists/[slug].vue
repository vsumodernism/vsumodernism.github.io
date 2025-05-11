<template>
    <div class="article">
        <template v-for="block in article">

            <div v-if="block.view === 'intro'" class="article-intro">
                <img v-if="block?.avatar" :src="block.avatar" class="article-intro__avatar"/>
                <h1 class="title_size_40 mb-15">{{article[0].title}}</h1>
                <div class="text-gray mb-15">{{article[0].dates}}</div>
                
                <template v-for="item in block.content">
                    <p v-if="typeof item === 'string'">{{item}}</p>
                    
                    <div v-else-if="typeof item === 'object'">
                        <img :src="item.img" alt=""/>
                        <div>{{item.description}}</div>
                    </div>
                </template>
                
                <ul v-if="block.tags.length" class="article-intro__tags">
                    <li v-for="tag in block.tags" class="article-intro__tag">{{tag}}</li>
                </ul>
                
                <div v-if="block.list" class="article-intro__list">
                    <span class="article-intro__list-title">{{block.list.title}}: </span>
                    <span v-html="parseIntroList(block.list.content)"/>
<!--                    <template v-for="item in block.list.content">-->
<!--                        <template v-if="typeof item === 'string'">{{item}},</template>-->
<!--                        -->
<!--                        <a v-else-if="typeof item === 'object'" href="item.link" class="">-->
<!--                            {{item.title}}-->
<!--                        </a>-->
<!--                    </template>-->
                </div>
            </div>

            <blockquote v-else-if="block.view === 'quote'" class="mb-40">
                {{block.content}}
            </blockquote>
    
            <div v-else-if="block.view === 'image'" class="article-picture mb-40">
                <img :src="block.img" class="article-picture__img" alt=""/>
                <div class="article-picture__description">{{block.description}}</div>
            </div>
    
            <template v-else-if="block.view === 'text'">
                <h2 v-if="block.title" class="mb-10">{{block.title}}</h2>
                
                <template v-for="item in block.content">
                    <p v-if="typeof item === 'string'">{{item}}</p>
                    
                    <div v-else-if="typeof item === 'object'" class="article-picture mb-40">
                        <img :src="item.img" class="article-picture__img" alt=""/>
                        <div class="article-picture__description">{{item.description}}</div>
                    </div>
                </template>
            </template>
            
            <h2 v-else-if="block.view === 'headline'" class="title_size_25 mt-40 mb-40">{{block.title}}</h2>
    
            <div v-else-if="block.view === 'period'" class="period">
                <h3 class="mb-10">{{block.title}}</h3>
                
                <template v-for="item in block.content">
                    <p v-if="typeof item === 'string'">{{item}}</p>
                    
                    <div v-else-if="typeof item === 'object'">
                        <img :src="item.img" alt=""/>
                        <div>{{item.description}}</div>
                    </div>
                </template>
                
                <div class="period__pictures">
                    <div v-if="block?.pictures?.length" v-for="picture in block.pictures" class="picture">
                        <div class="picture__cover"
                             :class="{'picture__cover_fields': picture.view === 'fields'}"
                             :style="picture?.bg ? `background-color: #${picture.bg}` : null">
                            <img :src="picture.img" class="picture__img"/>
                            <div class="picture__style">{{picture.style}}</div>
                        </div>
                        <span class="picture__name">«{{picture.name}}»</span>
                    </div>
                </div>
            </div>
        
        </template>
    </div>
</template>

<script>
export default defineNuxtComponent({
	name: 'PageArtist',
	async setup() {
		let article;
        const route = useRoute();

		try {
			const response = await $fetch(`/data/artists/${route.params.slug}.json`);

			if (response) {
                article = response;
			}
		} catch (e) {
            console.log(e)
		}

		// useSeoMeta({
		// 	title: t('pages.games.title'),
		// 	ogTitle: t('pages.games.title'),
		// 	description: t('pages.games.description'),
		// 	ogDescription: t('pages.games.description'),
		// 	ogImage: $config.public.OG_DEFAULT_IMAGE,
		// 	robots: 'index, follow'
		// });

		return {
            article
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
        }
    }
})
</script>

<style scoped lang="scss">


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
