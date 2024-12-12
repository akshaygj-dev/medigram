const newsAPIKey = '6e593bd99630453689ce113dc8d3ab93';
let newsPage = 1;

async function fetchNews() {
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsAPIKey}&page=${newsPage}`);
    const data = await response.json();

    if (data.status === 'ok') {
        const articles = data.articles;
        displayNews(articles);
        return articles; // Returning the articles for the load more functionality
    }
}

function displayNews(articles) {
    const newsContainer = document.getElementById('news-cards-container');
  
    articles.forEach(article => {
        const newsCard = document.createElement('div');
        newsCard.classList.add('news-card');
  
        // Create the image element only if there's an image URL
        if (article.urlToImage) {
            const img = document.createElement('img');
            img.src = article.urlToImage;
            img.alt = 'News Image';
            newsCard.appendChild(img);
        }
  
        // Create the title and description
        const newsTitle = document.createElement('h3');
        newsTitle.textContent = article.title;

        const newsDescription = document.createElement('p');
        newsDescription.textContent = article.description || 'No description available.';
  
        newsCard.appendChild(newsTitle);
        newsCard.appendChild(newsDescription);
        newsContainer.appendChild(newsCard);
    });
}

document.getElementById('load-more-news').addEventListener('click', async () => {
    newsPage++; // Increment page number for "load more" functionality
    await fetchNews(); // Fetch more news
});

// Initial news fetch
document.addEventListener('DOMContentLoaded', async () => {
    await fetchNews(); // Fetch and display the first set of news
});


const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// function to simulate interaction with Gemini AI API
async function sendMessageToAI(message) {
    const apiKey = 'AIzaSyBrUxvyRz-aFwr2UVyubax0OM7gW4Z_gDY';  // Replace with your actual API key

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "contents": [
                {
                    "parts": [
                        { "text": message }
                    ]
                }
            ]
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch AI response');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}


function addMessageToChat(content, isUser = true) {
    const messageBubble = document.createElement('div');
    messageBubble.classList.add('chat-message');
    messageBubble.classList.add(isUser ? 'user-message' : 'ai-message');
    messageBubble.textContent = content;

    chatBox.appendChild(messageBubble);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
}

sendBtn.addEventListener('click', async () => {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        addMessageToChat(userMessage, true);
        userInput.value = ''; // Clear input field

        const aiResponse = await sendMessageToAI(userMessage);
        addMessageToChat(aiResponse, false);
    }
});

userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendBtn.click();
    }
});

// Handle the send button click
document.getElementById('send-btn').addEventListener('click', async () => {
    const userMessage = document.getElementById('user-input').value;
    if (userMessage.trim()) {
        // Display user message in chat
        const userMessageElement = document.createElement('div');
        userMessageElement.classList.add('user-message');
        userMessageElement.textContent = userMessage;
        document.getElementById('chat-box').appendChild(userMessageElement);

        // Clear input field
        document.getElementById('user-input').value = '';

        // Get AI response
        const aiResponse = await sendMessageToAI(userMessage);

        // Display AI message in chat
        const aiMessageElement = document.createElement('div');
        aiMessageElement.classList.add('ai-message');
        aiMessageElement.textContent = aiResponse;
        document.getElementById('chat-box').appendChild(aiMessageElement);

        // Scroll to bottom of the chat
        document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
    }
});