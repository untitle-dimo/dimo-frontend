const url = import.meta.env.VITE_BACKEND_URL;
import { page } from '$app/stores';

/**
 * 
 * @param {string} category 
 * @returns 
 */
async function get_pages(category) {
    const result = await fetch(`${url}/api/place?category=${category}&tags=`);
    const data = await result.json();

    /**
     * @description The pages database
     * @type {{categories: {id: number, categoryName: string}[], place: {category: {id: number, categoryName: string}, title: string, link: string, tags: {tag: string, id: number}[], content: string, id: number}}[]}
     */
    const data_pages = data.places;

    return data_pages.map((page) => {
        return {
            category: page.categories[0]?.categoryName || "",
            title: page.place.title,
            link: page.place.link,
            tags: page.place.tags.map((tag) => tag.tag),
            description: page.place.content,
            id: page.place.id,
        };
    });
}

/**
 * 
 * @param {string} category 
 * @returns 
 */
async function get_tags(category = "") {
    const result = await fetch(`${url}/api/tag?category=${category}`);

    /**
     * @description The tags database
     * @type {{tags: {tag: string, id: number}[]}}
     */
    const data = await result.json();

    return data.tags.map(tag => tag.tag);
}

async function get_categories() {
    const result = await fetch(`${url}/api/place/cat/`);

    /**
     * @description The categories database
     * @type {{categories: {categoryName: string, id: number}[]}}
     */
    const data = await result.json();
    return data.categories.map(category => category.categoryName);

}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
export async function load({ url }) {

    /**
     * @type {URLSearchParams}
     */
    const params = url.searchParams;
    let categoryParam = params.get("category") || "";
    let category = categoryParam;

    if (categoryParam === "전체") {
        category = "";
    }

    return {
        pages: await get_pages(category),
        tags: await get_tags(category),
        cats: await get_categories(),
        page: params.get("category"),

        now_cat: categoryParam,
    }
}