-- ==============================================================================
-- AI Hub — Seed Data
-- Realistic categories and verified tools for directory population
-- ==============================================================================

-- 1. Insert Categories
INSERT INTO public.categories (id, name, slug, description, icon) VALUES
('c1000000-0000-0000-0000-000000000001', 'Text & LLMs', 'text-llms', 'Large language models, writing assistants, and reasoning engines.', 'Bot'),
('c1000000-0000-0000-0000-000000000002', 'Image & Art', 'image-art', 'Generative art, photo manipulation, and AI design tools.', 'Image'),
('c1000000-0000-0000-0000-000000000003', 'Code & Dev', 'code-dev', 'Code completion, pair programming, debugging, and IDEs.', 'Code'),
('c1000000-0000-0000-0000-000000000004', 'Audio & Speech', 'audio-speech', 'Voice synthesis, music generation, and audio mastering.', 'Headphones'),
('c1000000-0000-0000-0000-000000000005', 'Video Generation', 'video-generation', 'Text-to-video, avatar animation, and video editing suites.', 'Video'),
('c1000000-0000-0000-0000-000000000006', 'Productivity', 'productivity', 'Workflow automation, summarization, and agentic workflows.', 'Zap'),
('c1000000-0000-0000-0000-000000000007', 'Research & Data', 'research-data', 'Scientific literature search, paper summarization, and data extraction.', 'Search')
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Tools
INSERT INTO public.tools (
    id, name, slug, description, logo_url, official_url,
    category_id, pricing_type, tags, is_featured, is_published,
    integration_mode, external_account_required, features, use_cases
) VALUES
(
    't1000000-0000-0000-0000-000000000001',
    'ChatGPT',
    'chatgpt',
    'Versatile conversational AI developed by OpenAI, capable of complex reasoning, coding, writing, and creative generation.',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
    'https://chatgpt.com',
    'c1000000-0000-0000-0000-000000000001',
    'Freemium',
    ARRAY['LLM', 'Writing', 'Chatbot', 'Multimodal'],
    true, true, 'external_link', true,
    ARRAY['Advanced data analysis', 'Web browsing capabilities', 'Custom GPT ecosystem', 'Image generation via DALL-E'],
    ARRAY['Drafting essays & emails', 'Debugging code snippets', 'Brainstorming project concepts']
),
(
    't1000000-0000-0000-0000-000000000002',
    'Claude',
    'claude',
    'Next-generation AI assistant built by Anthropic with a focus on safety, exceptional long-context comprehension, and nuanced coding.',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=128&auto=format&fit=crop&q=80',
    'https://claude.ai',
    'c1000000-0000-0000-0000-000000000001',
    'Freemium',
    ARRAY['LLM', 'Reasoning', 'Code', 'Long Context'],
    true, true, 'external_link', true,
    ARRAY['200k token context window', 'Artifacts interactive preview', 'High precision technical writing', 'Vision analysis'],
    ARRAY['Full codebase refactoring', 'Legal document analysis', 'Technical documentation synthesis']
),
(
    't1000000-0000-0000-0000-000000000003',
    'Cursor',
    'cursor',
    'An intelligent, AI-first code editor built on VS Code, engineered to pair program across multi-file codebases seamlessly.',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=128&auto=format&fit=crop&q=80',
    'https://cursor.com',
    'c1000000-0000-0000-0000-000000000003',
    'Freemium',
    ARRAY['IDE', 'Developer Tools', 'Code Completion', 'AI Pair Programmer'],
    true, true, 'external_link', true,
    ARRAY['Multi-file codebase indexing', 'Inline diff editing', 'Chat with your whole repository', 'Custom model selection'],
    ARRAY['Accelerated software engineering', 'Instant bug fixing across modules', 'Rapid prototyping']
),
(
    't1000000-0000-0000-0000-000000000004',
    'Midjourney',
    'midjourney',
    'Industry-leading generative image engine creating photorealistic art, concept designs, and creative imagery from text prompts.',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=128&auto=format&fit=crop&q=80',
    'https://midjourney.com',
    'c1000000-0000-0000-0000-000000000002',
    'Paid',
    ARRAY['Art', 'Image Generation', 'Design', 'Creative'],
    true, true, 'external_link', true,
    ARRAY['Hyper-realistic textures', 'Inpainting and outpainting', 'Style reference tuning', 'Web editor interface'],
    ARRAY['Concept art creation', 'Marketing visual assets', 'Fashion & product rendering']
),
(
    't1000000-0000-0000-0000-000000000005',
    'ElevenLabs',
    'elevenlabs',
    'Premier generative voice AI platform providing lifelike speech synthesis, voice cloning, and dubbing in dozens of languages.',
    'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=128&auto=format&fit=crop&q=80',
    'https://elevenlabs.io',
    'c1000000-0000-0000-0000-000000000004',
    'Freemium',
    ARRAY['Voice', 'Text-to-Speech', 'Audio', 'Dubbing'],
    true, true, 'external_link', true,
    ARRAY['Emotion-rich voice generation', 'Zero-shot voice cloning', 'Automated video dubbing', 'Developer API'],
    ARRAY['Audiobook narration', 'Video game character voiceover', 'Localization & translation']
),
(
    't1000000-0000-0000-0000-000000000006',
    'Runway Gen-3',
    'runway-gen-3',
    'Cutting-edge generative video platform creating cinematic video clips with precise motion control and camera dynamics.',
    'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=128&auto=format&fit=crop&q=80',
    'https://runwayml.com',
    'c1000000-0000-0000-0000-000000000005',
    'Freemium',
    ARRAY['Video', 'Generative Video', 'VFX', 'Animation'],
    true, true, 'external_link', true,
    ARRAY['Text-to-video & image-to-video', 'Motion brush manipulation', 'Camera trajectory controls', 'High definition export'],
    ARRAY['Commercial video production', 'Music video VFX', 'Social media creative content']
),
(
    't1000000-0000-0000-0000-000000000007',
    'Perplexity AI',
    'perplexity-ai',
    'AI-powered conversational search engine delivering cited, real-time answers with source attribution and follow-up exploration.',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=128&auto=format&fit=crop&q=80',
    'https://perplexity.ai',
    'c1000000-0000-0000-0000-000000000007',
    'Freemium',
    ARRAY['Search', 'Research', 'Citations', 'Knowledge'],
    true, true, 'external_link', false,
    ARRAY['Inline academic and web citations', 'Pro Search multi-step research', 'File & data analysis', 'Collections sharing'],
    ARRAY['Market research', 'Academic literature discovery', 'Current events verification']
),
(
    't1000000-0000-0000-0000-000000000008',
    'v0 by Vercel',
    'v0-dev',
    'Generative UI system powered by AI that turns natural language descriptions into production-ready React and Tailwind components.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80',
    'https://v0.dev',
    'c1000000-0000-0000-0000-000000000003',
    'Freemium',
    ARRAY['Frontend', 'UI Design', 'React', 'Tailwind'],
    false, true, 'external_link', true,
    ARRAY['Instant React & Tailwind code generation', 'Interactive preview sandbox', 'Figma copy-paste export', 'Iterative refinements'],
    ARRAY['Dashboard wireframing', 'Landing page prototyping', 'Component library acceleration']
),
(
    't1000000-0000-0000-0000-000000000009',
    'Stable Diffusion',
    'stable-diffusion',
    'Open-weight text-to-image synthesis model enabling flexible on-premise and local creative image generation pipelines.',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=128&auto=format&fit=crop&q=80',
    'https://stability.ai',
    'c1000000-0000-0000-0000-000000000002',
    'Open Source',
    ARRAY['Open Source', 'Image Generation', 'LoRA', 'Local AI'],
    false, true, 'external_link', false,
    ARRAY['Full weights downloadable', 'ControlNet integration', 'LoRA fine-tuning support', 'ComfyUI node workflows'],
    ARRAY['Custom model fine-tuning', 'Private on-premise visual generation', 'Creative exploration']
),
(
    't1000000-0000-0000-0000-000000000010',
    'Notion AI',
    'notion-ai',
    'Connected AI workspace assistant that drafts, brainstorms, summarizes meetings, and answers questions across team notes.',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=128&auto=format&fit=crop&q=80',
    'https://notion.so',
    'c1000000-0000-0000-0000-000000000006',
    'Paid',
    ARRAY['Productivity', 'Notes', 'Team Collaboration', 'Knowledge Base'],
    false, true, 'external_link', true,
    ARRAY['Workspace-wide Q&A', 'Automated meeting summaries', 'Content translation', 'Tone editing'],
    ARRAY['Team knowledge management', 'Sprint retrospectives', 'Meeting notes distillation']
)
ON CONFLICT (slug) DO NOTHING;

-- 3. Default Site Settings
INSERT INTO public.site_settings (key, value) VALUES
('branding', '{"name": "AI Hub", "tagline": "Discover the Best AI Tools", "description": "Curated, verified directory of cutting-edge artificial intelligence tools, platforms, and models."}'::jsonb),
('features', '{"allowRegistration": true, "requireManualApproval": false, "enableReviews": false, "showAffiliateDisclosures": true}'::jsonb),
('contact', '{"email": "support@aihub.local", "twitter": "@aihub", "github": "aihub"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 4. Initial Integration Status
INSERT INTO public.integration_status (provider, status, last_checked_at) VALUES
('gemini', 'unconfigured', now()),
('openai', 'unconfigured', now()),
('resend', 'unconfigured', now())
ON CONFLICT (provider) DO NOTHING;
