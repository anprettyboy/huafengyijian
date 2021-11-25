module.exports = {
	base: '/',
	title: 'VuePress',
	description: '一剑光寒九州颤!',
	dest: './docs',
    head: [
        [
            'link', 
            { 
                rel: 'icon', 
                href: './../favicon.ico' 
            }
        ]
    ],
    theme: '@vuepress/blog'
};