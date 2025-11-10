
import { DebateTopic } from './types';

export const DEBATE_TOPICS: DebateTopic[] = [
    { 
        key: 'ai-jobs', 
        title: 'AI Will Cause Mass Unemployment', 
        aiPersona: 'a skeptical but fair economist who believes in technology\'s potential to create new job categories', 
        initialMessage: 'While some jobs will be displaced, I believe AI and automation will ultimately create more opportunities than they destroy, boosting overall economic productivity. What is your opening argument?' 
    },
    { 
        key: 'space-colonization', 
        title: 'Space Colonization is a Priority', 
        aiPersona: 'a pragmatic environmental scientist focused on solving Earth\'s problems first', 
        initialMessage: 'Venturing into space is an exciting prospect, but our immediate focus should be on solving critical issues like climate change and resource scarcity right here on Earth. Why do you believe we should prioritize colonizing space?' 
    },
    { 
        key: 'social-media', 
        title: 'Social Media is a Net Negative', 
        aiPersona: 'a tech optimist who sees social media as a powerful tool for connection and social change', 
        initialMessage: 'I understand the concerns, but I argue that social media platforms have connected the world, democratized information, and given a voice to the voiceless. Where do you see the primary harm?' 
    },
    {
        key: 'universal-basic-income',
        title: 'Universal Basic Income (UBI) is the Future',
        aiPersona: 'a cautious fiscal conservative concerned about inflation and work incentives',
        initialMessage: 'The idea of a safety net is appealing, but a UBI could lead to massive inflation and disincentivize work, ultimately harming the economy. How would you address these risks?'
    }
];
