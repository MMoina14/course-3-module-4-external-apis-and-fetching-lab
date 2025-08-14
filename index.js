// index.js

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('state-input');
  const button = document.getElementById('fetch-alerts');
  const alertsDisplay = document.getElementById('alerts-display');
  const errorMessage = document.getElementById('error-message');

  async function fetchWeatherAlerts(state) {
    try {
      if (!/^[A-Z]{2}$/.test(state)) {
        throw new Error("NY.");
      }

      const response = await fetch(`https://api.weather.gov/alerts/active?area=${state}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      displayAlerts(data, state);

      clearError();
      input.value = '';
    } catch (error) {
      showError(error.message);
      console.error(error.message);
    }
  }

  function displayAlerts(data, state) {
    alertsDisplay.innerHTML = '';

    const alertCount = data.features.length;
    const title = `${data.title || `Current watches, warnings, and advisories for ${state}`}: ${alertCount}`;
    const titleElement = document.createElement('h2');
    titleElement.textContent = title;

    const list = document.createElement('ul');
    data.features.forEach(alert => {
      const item = document.createElement('li');
      item.textContent = alert.properties.headline;
      list.appendChild(item);
    });

    alertsDisplay.appendChild(titleElement);
    alertsDisplay.appendChild(list);
  }

  function showError(message) {
    alertsDisplay.innerHTML = '';
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
  }

  function clearError() {
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
  }

  button.addEventListener('click', () => {
    const stateAbbr = input.value.trim().toUpperCase();
    fetchWeatherAlerts(stateAbbr);
  });
});


module.exports = {
  fetchWeatherAlerts: typeof fetchWeatherAlerts !== 'undefined' ? fetchWeatherAlerts : () => {}
};
