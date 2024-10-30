(function () {
  let isPause = false;
  const car = document.querySelector('.car');
  const trees = document.querySelectorAll('.tree');
  const speed = 3;
  let animationId = null;
  const firstTree = trees[0];
  animationId = requestAnimationFrame(startGame);

  function getCoordinateY(element) {
    const matrix = window.getComputedStyle(element).transform;
    const matrixArray = matrix.split(',');
    const coordinateY = parseFloat(matrixArray[matrixArray.length - 1]);
    return coordinateY;
  }
  function startGame() {
    animationId = requestAnimationFrame(startGame);
    animationTrees();
    // console.log('currentValue:', animationId);
  }

  function animationTrees() {
    const newCoordinateY = getCoordinateY(firstTree) + speed;
    firstTree.style.transform = `translateY(${newCoordinateY}px)`;
  }

  const button = document.querySelector('.btn');
  button.addEventListener('click', () => {
    isPause = !isPause;
    if (isPause) {
      cancelAnimationFrame(animationId);
      button.children[0].style.display = 'none';
      button.children[1].style.display = 'block';
    } else {
      requestAnimationFrame(startGame);
      button.children[0].style.display = 'block';
      button.children[1].style.display = 'none';
    }
  });
})();
