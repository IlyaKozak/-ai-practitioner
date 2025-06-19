const API_URL = 'http://localhost:8080/query?q=';

document.addEventListener('DOMContentLoaded', function () {
  const inputForm = document.getElementById('input-form');
  const outputContainer = document.getElementById('output-container');
  const userInput = document.getElementById('user-input');

  inputForm.addEventListener('submit', handleSubmit);

  async function handleSubmit(e) {
    e.preventDefault();
    const userQuestion = userInput.value.trim();
    if (!userQuestion) return;
    userInput.value = '';

    outputContainer.innerHTML =
      '<p>Making your request... Please wait <span class="loader"></span></p>';
    const jsonResponse = await queryAPI(userQuestion);

    if (!jsonResponse.content) {
      console.log(jsonResponse);
      outputContainer.textContent = jsonResponse.message;
      return;
    }
    console.log(jsonResponse.content);
    outputContainer.innerHTML = jsonResponse.content;
  }
});

async function queryAPI(query) {
  const request = await fetch(`${API_URL}${encodeURI(query)}`);
  const jsonResponse = await request.json();

  return jsonResponse;
}
