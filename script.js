(function () {
  let isPause = false;
  const car = document.querySelector('.car');
  const trees = document.querySelectorAll('.tree');
  let animationId = null;
  const firstTree = trees[0];
  animationId = requestAnimationFrame(startGame);
  const allTrees = [];
  trees.forEach((el) => {
    const id = el.id;
    const coordinates = getCoordinate(el);
    allTrees.push({ element: el, coordinates });
  });
  function startGame() {
    animationId = requestAnimationFrame(startGame);
    animationTrees();
  }

  const biggestTree = allTrees.reduce((acc, el) => {
    if (el.element.height > acc) {
      return el.element.height;
    }
    return acc;
  }, 0);

  function animationTrees() {
    const speed = document.querySelector('.speed input').value;
    allTrees.forEach((el) => {
      const { element, coordinates } = el;
      let newCoordinateY = coordinates.y + parseFloat(speed);

      if (newCoordinateY > window.innerHeight) {
        newCoordinateY = -biggestTree;
      }
      coordinates.y = newCoordinateY;
      element.style.transform = `translate(${coordinates.x}px, ${newCoordinateY}px)`;
    });
  }

  function getCoordinate(element) {
    const matrix = window.getComputedStyle(element).transform;
    const matrixArray = matrix.split(',');
    const coordinateY = parseFloat(matrixArray[matrixArray.length - 1]);
    const coordinateX = parseFloat(matrixArray[matrixArray.length - 2]);
    return { x: coordinateX, y: coordinateY };
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
