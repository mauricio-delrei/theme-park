document.addEventListener('DOMContentLoaded', () => {
  const blocks = document.querySelectorAll('.block');
  const image = document.getElementById('ride-image');
  const guessInput = document.getElementById('ride-guess');
  const submitButton = document.getElementById('submit-guess');
  const message = document.getElementById('game-message');

  let revealedBlocks = 0;
  const maxRevealedBlocks = blocks.length;

  // Load the image to ensure the dimensions are correct
  const img = new Image();
  img.src = image.src;
  img.onload = () => {
    const blockWidth = img.width / 2; // Width of the image divided into 2 columns
    const blockHeight = img.height / 2; // Height divided into 2 rows

    // Function to reveal the blocks when clicked
    blocks.forEach((block, index) => {
      block.addEventListener('click', () => {
        if (!block.classList.contains('revealed')) {
          const row = Math.floor(index / 2); // Row (0 or 1)
          const col = index % 2; // Column (0 or 1)

          // Set the part of the image to be revealed
          block.style.backgroundImage = `url(${image.src})`;
          block.style.backgroundPosition = `-${col * blockWidth}px -${row * blockHeight}px`;
          block.style.backgroundSize = `${blockWidth * 2}px ${blockHeight * 2}px`; // Cover the entire area
          block.classList.add('revealed');
          revealedBlocks++;

          // Check if all blocks have been revealed
          if (revealedBlocks === maxRevealedBlocks) {
            message.textContent = "All blocks revealed!";
          }
        }
      });
    });
  };

  // Function to handle the user's guess
  submitButton.addEventListener('click', () => {
    const guess = guessInput.value.toLowerCase().trim();
    const correctAnswer = "hangover"; // The correct answer (can be changed)

    if (guess === correctAnswer.toLowerCase()) {
      message.textContent = "Correct! You guessed the ride!";
    } else {
      message.textContent = "Incorrect. Try again!";
    }
  });
});
