document.getElementById('analyzeButton').addEventListener('click', async () => {
    const articleText = document.getElementById('articleText').value.trim();
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultContainer = document.getElementById('resultContainer');
    
    if (!articleText) {
      alert('Please enter an article text to analyze.');
      return;
    }
  
    loadingSpinner.style.display = 'block';
    resultContainer.style.display = 'none';
  
    try {
      // Replace with your Colab ngrok URL
      const FLASK_API_URL = 'https://YOUR-NGROK-URL.ngrok.io/predict';
      
      const response = await fetch(FLASK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: articleText }),
      });
  
      const prediction = await response.json();
      
      // Calculate text characteristics
      const words = articleText.split(/\s+/);
      const uniqueWords = new Set(words.map(w => w.toLowerCase()));
      const avgWordLength = words.join('').length / words.length;
      
      // Display results
      resultContainer.innerHTML = `
        <div class="prediction ${prediction.is_fake ? 'fake' : 'real'}">
          🔍 Prediction: ${prediction.is_fake ? 'Fake News' : 'Real News'}
        </div>
        
        <h3>Probability Breakdown</h3>
        <div class="confidence-bar">
          <div class="confidence-fill" style="width: ${prediction.confidence * 100}%"></div>
        </div>
        <p>Confidence: ${(prediction.confidence * 100).toFixed(2)}%</p>
        
        <h3>Text Characteristics</h3>
        <div class="metrics">
          <div class="metric-item">
            <strong>Word Count:</strong> ${words.length}
          </div>
          <div class="metric-item">
            <strong>Unique Words:</strong> ${uniqueWords.size}
          </div>
          <div class="metric-item">
            <strong>Unique Word Ratio:</strong> ${(uniqueWords.size / words.length).toFixed(2)}
          </div>
          <div class="metric-item">
            <strong>Avg Word Length:</strong> ${avgWordLength.toFixed(2)}
          </div>
        </div>
        
        <h3>Analysis Summary</h3>
        <p>The model analyzed this article with ${(prediction.confidence * 100).toFixed(2)}% confidence in its classification. 
        The text contains ${words.length} words, with ${uniqueWords.size} unique words, 
        suggesting a ${(uniqueWords.size / words.length > 0.5) ? 'diverse' : 'repetitive'} vocabulary usage.</p>
      `;
      
      resultContainer.style.display = 'block';
    } catch (error) {
      resultContainer.innerHTML = `<div class="error">Error: ${error.message}</div>`;
      resultContainer.style.display = 'block';
    } finally {
      loadingSpinner.style.display = 'none';
    }
  });