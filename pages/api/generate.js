import { Configuration, OpenAIApi } from 'openai';
console.log(process.env.OPEN_API_KEY);
const configuration = new Configuration({
  apiKey: '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'
});

const openai = new OpenAIApi(configuration);
const basePromptPrefix = 
`
Write me a report in the style of warren buffet with the title below. Please make sure the report is understandable by a common man.

Title:
`
const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}\n`,
    temperature: 0.7,
    max_tokens: 250,
  });
  const basePromptOutput = baseCompletion.data.choices.pop();

  const secondPrompt = 
  `
  Take the table of contents and title of the report below and generate a report written in the style of warren buffet. Make it feel like a story. Don't just list the points. Go deep into each one. Explain why.

  Title: ${req.body.userInput}

  Table of Contents: ${basePromptOutput.text}

  report:
  `

  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.85,
		// I also increase max_tokens.
    max_tokens: 1250,
  });

  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;