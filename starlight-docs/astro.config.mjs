// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://anirudha.github.io',
	base: '/',
	integrations: [
		starlight({
			title: 'Getting Started with OpenSearch AgentOps',
			social: [
				{ 
					icon: 'github', 
					label: 'GitHub', 
					href: 'https://github.com/anirudha/opensearch-agentops-website' 
				}
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'index' },
						{ label: 'Quick Start', slug: 'quickstart' },
						{ label: 'Installation', slug: 'installation' },
					],
				},
			],
		}),
	],
});
