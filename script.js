(function () {
  let isPause = false;

  const car = document.querySelector('.car');
  const trees = document.querySelectorAll('.tree');
  let animationId = null;
  const firstTree = trees[0];
  const allTrees = [];
  const carCoordinates = getCoordinate(car);

  const carMove = {
    top: null,
    bottom: null,
    left: null,
    right: null,
  };

  animationId = requestAnimationFrame(startGame);
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

  window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowUp' && carMove.top === null) {
      carMove.top = requestAnimationFrame(carMoveToTop);
    } else if (e.code === 'ArrowDown' && carMove.bottom === null) {
      carMove.bottom = requestAnimationFrame(carMoveToBottom);
    } else if (e.code === 'ArrowLeft' && carMove.left === null) {
      carMove.left = requestAnimationFrame(carMoveToLeft);
    } else if (e.code === 'ArrowRight' && carMove.right === null) {
      carMove.right = requestAnimationFrame(carMoveToRight);
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowUp') {
      cancelAnimationFrame(carMove.top);
      carMove.top = null;
    } else if (e.code === 'ArrowDown') {
      cancelAnimationFrame(carMove.bottom);
      carMove.bottom = null;
    } else if (e.code === 'ArrowLeft') {
      cancelAnimationFrame(carMove.left);
      carMove.left = null;
    } else if (e.code === 'ArrowRight') {
      cancelAnimationFrame(carMove.right);
      carMove.right = null;
    }
  });

  function carMoveToTop() {
    const newCoordinateY = carCoordinates.y - 5;
    carCoordinates.y = newCoordinateY;
    car.style.transform = `translate(${carCoordinates.x}px, ${carCoordinates.y}px)`;
    carMove.top = requestAnimationFrame(carMoveToTop);
  }
  function carMoveToBottom() {
    const newCoordinateY = carCoordinates.y + 5;
    carCoordinates.y = newCoordinateY;
    car.style.transform = `translate(${carCoordinates.x}px, ${carCoordinates.y}px)`;
    carMove.bottom = requestAnimationFrame(carMoveToBottom);
  }
  function carMoveToLeft() {
    const newCoordinateX = carCoordinates.x - 5;
    carCoordinates.x = newCoordinateX;
    car.style.transform = `translate(${carCoordinates.x}px, ${carCoordinates.y}px)`;
    carMove.left = requestAnimationFrame(carMoveToLeft);
  }
  function carMoveToRight() {
    const newCoordinateX = carCoordinates.x + 5;
    carCoordinates.x = newCoordinateX;
    car.style.transform = `translate(${carCoordinates.x}px, ${carCoordinates.y}px)`;
    carMove.right = requestAnimationFrame(carMoveToRight);
  }
})();
