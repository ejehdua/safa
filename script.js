document.addEventListener('DOMContentLoaded', () => {
    const chatArea = document.getElementById('chat-area');
    const screenshotButton = document.getElementById('screenshot-button');
    const messageModal = document.getElementById('message-modal');
    const messageTextarea = document.getElementById('message-text');
    const saveMessageButton = document.getElementById('save-message-button');
    const cancelButton = document.getElementById('cancel-button');
    const systemMessage = document.getElementById('system-message');

    let messages = [
        { text: "וגם", sender: "grandson" }
        { text: "בגלל", sender: "grandson" },
        { text: "אבל למה אתה לא מאמין לי?!?!", sender: "grandma" },
        { text: "אבל סבתא,", sender: "grandson" },
    ];

    function renderMessages() {
        const currentSystemMessage = chatArea.querySelector('#system-message');
        chatArea.innerHTML = '';
        if (currentSystemMessage) {
            chatArea.appendChild(currentSystemMessage);
        }

        messages.forEach((msg, index) => {
            const messageContainer = document.createElement('div');
            messageContainer.classList.add('message-container', msg.sender);
            messageContainer.dataset.index = index;

            const messageElement = document.createElement('div');
            messageElement.classList.add('message', msg.sender);
            messageElement.textContent = msg.text;

            messageContainer.appendChild(messageElement);
            if (systemMessage && systemMessage.parentNode === chatArea) {
                chatArea.insertBefore(messageContainer, systemMessage.nextSibling);
            } else {
                chatArea.appendChild(messageContainer);
            }
        });
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    function showModal(msg, index) {
        messageTextarea.value = msg ? msg.text : '';
        messageModal.dataset.editingIndex = index;
        messageModal.querySelector('h3').textContent = 'ערוך הודעה';
        saveMessageButton.textContent = 'עדכן';
        messageModal.classList.add('visible');
        messageTextarea.focus();

        if (systemMessage) {
            systemMessage.style.display = 'none';
        }
    }

    function hideModal() {
        messageModal.classList.remove('visible');
        messageTextarea.value = '';
        messageModal.dataset.editingIndex = '';
        messageModal.querySelector('h3').textContent = 'הוסף/ערוך הודעה';
    }

    chatArea.addEventListener('click', (event) => {
        const messageContainer = event.target.closest('.message-container');
        if (messageContainer) {
            const index = parseInt(messageContainer.dataset.index, 10);
            if (!isNaN(index) && messages[index] && messages[index].sender === 'grandson') {
                showModal(messages[index], index);
                if (systemMessage) {
                    systemMessage.style.display = 'none';
                }
            }
        } else {
            if (systemMessage) {
                systemMessage.style.display = 'none';
            }
        }
    });

    saveMessageButton.addEventListener('click', () => {
        const text = messageTextarea.value.trim();
        if (!text) {
            alert('אנא הזן הודעה.');
            return;
        }
        const sender = 'grandson';

        const editingIndex = messageModal.dataset.editingIndex;

        if (editingIndex !== '') {
            const indexToEdit = parseInt(editingIndex, 10);
            if (!isNaN(indexToEdit) && messages[indexToEdit] && messages[indexToEdit].sender === 'grandson') {
                messages[indexToEdit].text = text;
            }
        }

        renderMessages();
        hideModal();
    });

    cancelButton.addEventListener('click', () => {
        hideModal();
    });

    messageModal.addEventListener('click', (event) => {
        if (event.target === messageModal) {
            hideModal();
        }
    });

    screenshotButton.addEventListener('click', () => {
        const wasModalVisible = messageModal.classList.contains('visible');
        const wasSystemMessageVisible = systemMessage && systemMessage.style.display !== 'none';

        if (wasModalVisible) {
            messageModal.style.display = 'none';
        }
        if (wasSystemMessageVisible) {
            systemMessage.style.display = 'none';
        }
        screenshotButton.style.display = 'none';

        const screenshotContent = document.createElement('div');
        screenshotContent.style.cssText = `
            width: 100%;
            height: ${chatArea.scrollHeight}px;
            overflow: hidden;
            padding: ${getComputedStyle(chatArea).padding};
            background-color: ${getComputedStyle(chatArea).backgroundColor};
        `;

        chatArea.querySelectorAll('.message-container').forEach(msgContainer => {
            screenshotContent.appendChild(msgContainer.cloneNode(true));
        });

        document.body.appendChild(screenshotContent);

        html2canvas(screenshotContent, {
            scale: 2,
            useCORS: true
        }).then(canvas => {
            document.body.removeChild(screenshotContent);

            if (wasModalVisible) {
                messageModal.style.display = '';
            }
            if (wasSystemMessageVisible) {
                systemMessage.style.display = '';
            }
            screenshotButton.style.display = '';

            const link = document.createElement('a');
            link.download = 'whatsapp_chat.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(err => {
            document.body.removeChild(screenshotContent);

            if (wasModalVisible) {
                messageModal.style.display = '';
            }
            if (wasSystemMessageVisible) {
                systemMessage.style.display = '';
            }
            screenshotButton.style.display = '';
            console.error('Error capturing screenshot:', err);
            alert('אירעה שגיאה בצילום המסך.');
        });
    });

    renderMessages();
});
