// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://anirudha.github.io',
	base: '/opensearch-agentops-website/docs',
	integrations: [
		starlight({
			title: 'Getting Started with OpenSearch AgentOps',
			logo: {
				src: './src/assets/opensearch-logo-darkmode.svg',
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/anirudha/opensearch-agentops-website' }],
			components: {
				// Override the default Header component
				Header: './src/components/CustomHeader.astro',
			},
			sidebar: [
				{
					label: '🚀 Get Started',
					autogenerate: { directory: 'get-started' },
				},
				{
					label: '🔧 Instrument',
					autogenerate: { directory: 'instrument' },
				},
				{
					label: '👁️ Observe',
					autogenerate: { directory: 'observe' },
				},
				{
					label: '🏷️ Annotate',
					autogenerate: { directory: 'annotate' },
				},
				{
					label: '📊 Evaluate',
					autogenerate: { directory: 'evaluate' },
				},
				{
					label: '📝 Prompts',
					autogenerate: { directory: 'prompts' },
				},
				{
					label: '🚀 Deploy',
					autogenerate: { directory: 'deploy' },
				},
				{
					label: '🔌 Integrations',
					autogenerate: { directory: 'integrations' },
				},
				{
					label: '📦 SDKs',
					autogenerate: { directory: 'sdks' },
				},
				{
					label: '🔐 Platform & Administration',
					autogenerate: { directory: 'platform' },
				},
			],
		}),
	],
});
