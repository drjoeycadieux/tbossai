import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import MarkdownIt from "markdown-it";

// API Key
let API_KEY = "AIzaSyA_-l4-8Otmcq8EKmOJ5LaVroGlb5GeGRc"; // Replace with your real API key

// DOM Elements
const form = document.querySelector("form")!;
const promptInput = document.querySelector('input[name="prompt"]')!;
const modelSelect = document.querySelector("#modelSelect") as HTMLSelectElement;
const output = document.querySelector(".output")!;

// Form submission event handler
form.onsubmit = async (ev: Event) => {
  ev.preventDefault();
  output.textContent = "Generating...";

  try {
    // Get selected model and user input
    const selectedModel = modelSelect.value;
    const contents = [
      {
        role: "user",
        parts: [{ text: promptInput.value }],
      },
    ];

    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: selectedModel,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

    // Call the model API
    const result = await model.generateContentStream({ contents });

    // Read and process the result stream
    let buffer: string[] = [];
    const md = new MarkdownIt();
    for await (let response of result.stream) {
      buffer.push(response.text());
      output.innerHTML = md.render(buffer.join(""));
    }
  } catch (e) {
    output.innerHTML += "<hr>" + e;
  }
};
