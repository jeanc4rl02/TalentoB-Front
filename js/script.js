document.getElementById('upload-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const files = document.getElementById('files').files;
    const urls = document.getElementById('urls').value.trim().split('\n').filter(url => url);
    const title = document.getElementById('title').value.trim();

    if (files.length + urls.length < 3 || files.length + urls.length > 5) {
        alert('Debe proporcionar entre 3 y 5 archivos o URLs.');
        return;
    }

    const formData = new FormData();
    for (let file of files) {
        formData.append('files', file);
    }
    formData.append('title', title);
    formData.append('urls', JSON.stringify(urls));

    try {
        const response = await fetch('http://localhost:8080/api/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Uploaded documents:', result);
        addMessage('system', 'Documentos cargados exitosamente.');
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        addMessage('system', 'Error al cargar los documentos.');
    }
});

document.getElementById('question-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const question = document.getElementById('question').value.trim();
    if (!question) {
        alert('Please enter a question.');
        return;
    }

    addMessage('user', question);

    const formData = new FormData();
    formData.append('question', question);

    const files = document.getElementById('files').files;
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    const urls = document.getElementById('urls').value.trim().split('\n').filter(url => url);
    for (let i = 0; i < urls.length; i++) {
        formData.append('urls', urls[i]);
    }

    try {
        const response = await fetch('http://localhost:8080/api/ask', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.text();
        addMessage('openai', data);
    } catch (error) {
        console.error('Error:', error);
        addMessage('system', 'Error al comunicarse con el servidor.');
    }
});

function addMessage(role, content) {
    const responseContainer = document.getElementById('response-container');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    if (role === 'user') {
        messageDiv.classList.add('user-message');
    } else if (role === 'openai') {
        messageDiv.classList.add('openai-message');
    } else {
        messageDiv.classList.add('system-message');
    }
    messageDiv.textContent = content;
    responseContainer.appendChild(messageDiv);
    responseContainer.scrollTop = responseContainer.scrollHeight;
}

