# 🤖 SmartBot – Simple GenAI Chat Assistant

**SmartBot** is a lightweight AI chatbot that gives structured, helpful responses to user questions. It’s designed as a beginner-friendly project to demonstrate all five key Generative AI concepts: system prompts, user prompts, tuning, structured output, function calling, and RAG.

---

## 🔧 How It Works

1. **User types a question**  
   Example: _“What is AI?”_ or _“What’s the weather in Jaipur?”_

2. **System + User Prompts**  
   - System prompt defines the assistant’s role (e.g., “You are a helpful, friendly chatbot.”)  
   - User prompt is the actual question typed by the user.

3. **Tuning Parameters**  
   - Users can choose response style:  
     - *Precise* (temperature = 0.3)  
     - *Creative* (temperature = 0.9)

4. **Structured Output**  
   - Responses are formatted as:
     - Bullet points  
     - Tables  
     - JSON (if needed)

5. **Function Calling**  
   - SmartBot detects when to call simple functions like:  
     - `calculate(expression)`  
     - `getWeather(city)`  
     - `getTime(location)`

6. **RAG (Retrieval-Augmented Generation)**  
   - For knowledge-based questions, SmartBot searches a small built-in knowledge base to generate factual answers.

---

## ✨ Key Features

### 🧠 Prompting  
Uses both system and user prompts to control behavior and tone.

### 🎛 Tuning  
User can choose between clear/direct or creative/informal response styles.

### 📄 Structured Output  
Returns clean and organized information – easy to understand or parse.

### 🔧 Function Calling  
Calls backend functions for live data (like weather, time, math).

### 📚 RAG  
Fetches relevant data from internal knowledge base before generating answers.

---

## ✅ Evaluation

| Metric        | How It’s Achieved                            |
|---------------|-----------------------------------------------|
| **Correctness**  | Uses basic RAG and function validation       |
| **Clarity**      | Structured formats like lists and tables     |
| **Speed**        | Lightweight with fast API responses          |
| **Simplicity**   | Easy for any user to interact and learn GenAI|

---

