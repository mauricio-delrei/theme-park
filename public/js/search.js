// public/js/search.js
document.getElementById('search-input').addEventListener('input', function() {
    const query = this.value;
    fetch(`/search?query=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => {
        // Update search results on the page
        document.getElementById('search-results').innerHTML = data.results.map(item => `<div>${item.name}</div>`).join('');
      });
});
