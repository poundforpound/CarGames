(function () {
  let isPause = false;
  let animationId = null;

  const car = document.querySelector('.car');
  const carWidth = car.clientWidth;
  const carHeight = car.clientHeight;
  const carMove = {
    top: null,
    bottom: null,
    left: null,
    right: null,
  };
  const carCoordinates = getCoordinate(car);

  const road = document.querySelector('.road');
  const roadHeight = road.clientHeight;
  const roadWidth = road.clientWidth;

  const trees = document.querySelectorAll('.tree');
  const firstTree = trees[0];
  const allTrees = [];

  const coin = document.querySelector('.coin');
  const coinCoordinates = getCoordinate(coin);

  const arrow = document.querySelector('.arrow');
  const arrowCoordinates = getCoordinate(arrow);

  const danger = document.querySelector('.danger');
  const dangerCoordinates = getCoordinate(danger);

  animationId = requestAnimationFrame(startGame);
  trees.forEach((el) => {
    const id = el.id;
    const coordinates = getCoordinate(el);
    allTrees.push({ element: el, coordinates });
  });
  function startGame() {
    animationId = requestAnimationFrame(startGame);
    const speed = document.querySelector('.speed input').value;
    animationTrees(speed);
    elementAnimation(speed, coinCoordinates, coin);
    elementAnimation(speed, arrowCoordinates, arrow);
    elementAnimation(speed, dangerCoordinates, danger);
  }

  const biggestTree = allTrees.reduce((acc, el) => {
    if (el.element.height > acc) {
      return el.element.height;
    }
    return acc;
  }, 0);

  function animationTrees(speed) {
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

  function elementAnimation(speed, elementCoordinates, element) {
    let newCoordinateY = elementCoordinates.y + parseFloat(speed);
    let newCoordinateX = elementCoordinates.x;
    if (newCoordinateY > window.innerHeight) {
      newCoordinateY = -element.clientHeight * 2;
      const direction = Math.floor(Math.random() * 2);
      const randomX = parseFloat(Math.random() * (road.clientWidth / 2 - element.clientWidth / 2));
      // if (direction === 0) {
      //   newCoordinateX = -randomX;
      // } else if (direction === 1) {
      //   newCoordinateX = randomX;
      // }
      newCoordinateX = direction === 0 ? -randomX : randomX;
    }
    elementCoordinates.y = newCoordinateY;
    elementCoordinates.x = newCoordinateX;
    element.style.transform = `translate(${elementCoordinates.x}px, ${elementCoordinates.y}px)`;
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
      cancelAnimationFrame(carMove.top);
      cancelAnimationFrame(carMove.bottom);
      cancelAnimationFrame(carMove.left);
      cancelAnimationFrame(carMove.right);
      button.children[0].style.display = 'none';
      button.children[1].style.display = 'block';
    } else {
      requestAnimationFrame(startGame);
      button.children[0].style.display = 'block';
      button.children[1].style.display = 'none';
    }
  });

  window.addEventListener('keydown', (e) => {
    if (isPause) {
      return;
    }
    if (e.code === 'ArrowUp' && carMove.top === null) {
      if (carMove.bottom !== null) {
        return;
      }
      carMove.top = requestAnimationFrame(carMoveToTop);
    } else if (e.code === 'ArrowDown' && carMove.bottom === null) {
      if (carMove.top !== null) {
        return;
      }
      carMove.bottom = requestAnimationFrame(carMoveToBottom);
    } else if (e.code === 'ArrowLeft' && carMove.left === null) {
      if (carMove.right !== null) {
        return;
      }
      carMove.left = requestAnimationFrame(carMoveToLeft);
    } else if (e.code === 'ArrowRight' && carMove.right === null) {
      if (carMove.left !== null) {
        return;
      }
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
    if (newCoordinateY < 0) {
      return;
    }
    carCoordinates.y = newCoordinateY;
    car.style.transform = `translate(${carCoordinates.x}px, ${carCoordinates.y}px)`;
    carMove.top = requestAnimationFrame(carMoveToTop);
  }
  function carMoveToBottom() {
    const newCoordinateY = carCoordinates.y + 5;
    if (newCoordinateY > roadHeight - carHeight) {
      return;
    }
    carCoordinates.y = newCoordinateY;
    car.style.transform = `translate(${carCoordinates.x}px, ${carCoordinates.y}px)`;
    carMove.bottom = requestAnimationFrame(carMoveToBottom);
  }
  function carMoveToLeft() {
    const newCoordinateX = carCoordinates.x - 5;
    if (newCoordinateX - carWidth / 2 < -roadWidth / 2) {
      return;
    }
    carCoordinates.x = newCoordinateX;
    car.style.transform = `translate(${carCoordinates.x}px, ${carCoordinates.y}px)`;
    carMove.left = requestAnimationFrame(carMoveToLeft);
  }
  function carMoveToRight() {
    if (carCoordinates.x + carWidth / 2 > roadWidth / 2) {
      return;
    }
    const newCoordinateX = carCoordinates.x + 5;
    carCoordinates.x = newCoordinateX;
    car.style.transform = `translate(${carCoordinates.x}px, ${carCoordinates.y}px)`;
    carMove.right = requestAnimationFrame(carMoveToRight);
  }
})();
