(function () {
  let isPause = false;
  let animationId = null;
  let speed = 3; // Инициализация глобальной переменной speed

  const button = document.querySelector('.btn');
  const road = document.querySelector('.road');
  const car = document.querySelector('.car');
  const coin = document.querySelector('.coin');
  const arrow = document.querySelector('.arrow');
  const danger = document.querySelector('.danger');
  const trees = document.querySelectorAll('.tree');
  const score = document.querySelector('.score div');
  const speedInput = document.querySelector('.speed input');
  const backdrop = document.querySelector('.backdrop');
  const scoreContainer = document.querySelector('.score');
  const speedContainer = document.querySelector('.speed');
  const restartButton = document.querySelector('.restart-button');

  const allTrees = [];

  class ElementInfo {
    constructor(element, move = {}) {
      this.element = element;
      this.coordinates = getCoordinate(element);
      this.width = element.clientWidth;
      this.height = element.clientHeight;
      this.visible = true;
      this.move = move;
    }
  }

  const carInfo = new ElementInfo(car, {
    move: {
      top: null,
      bottom: null,
      left: null,
      right: null,
    },
  });
  const coinInfo = new ElementInfo(coin);
  const arrowInfo = new ElementInfo(arrow);
  const dangerInfo = new ElementInfo(danger);

  animationId = requestAnimationFrame(startGame);
  trees.forEach((el) => {
    const id = el.id;
    const coordinates = getCoordinate(el);
    allTrees.push({ element: el, coordinates });
  });

  function startGame() {
    animationId = requestAnimationFrame(startGame);
    if (hasCollision(carInfo, dangerInfo)) {
      return finishGame();
    }
    speed = parseFloat(speedInput.value); // Обновление глобальной переменной speed
    animationTrees(speed);
    elementAnimation(speed, coinInfo, coin);
    elementAnimation(speed, arrowInfo, arrow);
    elementAnimation(speed, dangerInfo, danger);
    if (coinInfo.visible && hasCollision(carInfo, coinInfo)) {
      coin.style.display = 'none';
      score.innerHTML = parseInt(score.innerHTML) + 1;
      coinInfo.visible = false;
      if (parseInt(score.innerHTML) % 2 === 0) {
        speed += 1;
        speedInput.value = speed;
      }
    }
  }
  const biggestTree = allTrees.reduce((acc, el) => {
    if (el.element.clientHeight > acc) {
      return el.element.clientHeight;
    }
    return acc;
  }, 0);

  function animationTrees(speed) {
    allTrees.forEach((el) => {
      const { element, coordinates } = el;
      let newCoordinateY = coordinates.y + speed;

      if (newCoordinateY > window.innerHeight) {
        newCoordinateY = -biggestTree;
      }
      coordinates.y = newCoordinateY;
      element.style.transform = `translate(${coordinates.x}px, ${newCoordinateY}px)`;
    });
  }

  function elementAnimation(speed, elementInfo, element) {
    let newCoordinateY = elementInfo.coordinates.y + speed;
    let newCoordinateX = elementInfo.coordinates.x;
    if (newCoordinateY > window.innerHeight) {
      newCoordinateY = -element.clientHeight * 2;
      const direction = Math.floor(Math.random() * 2);
      const randomX = parseFloat(Math.random() * (road.clientWidth / 2 - element.clientWidth / 2));
      newCoordinateX = direction === 0 ? -randomX : randomX;
      element.style.display = 'initial';
      elementInfo.visible = true;
    }
    elementInfo.coordinates.y = newCoordinateY;
    elementInfo.coordinates.x = newCoordinateX;
    element.style.transform = `translate(${elementInfo.coordinates.x}px, ${elementInfo.coordinates.y}px)`;
  }

  function getCoordinate(element) {
    const matrix = window.getComputedStyle(element).transform;
    const matrixArray = matrix.split(',');
    const coordinateY = parseFloat(matrixArray[matrixArray.length - 1]);
    const coordinateX = parseFloat(matrixArray[matrixArray.length - 2]);
    return { x: coordinateX, y: coordinateY };
  }

  function finishGame() {
    cancelAnimationFrame(animationId);
    cancelAnimationFrame(carInfo.move.top);
    cancelAnimationFrame(carInfo.move.bottom);
    cancelAnimationFrame(carInfo.move.left);
    cancelAnimationFrame(carInfo.move.right);
    backdrop.style.display = 'flex';
    button.style.display = 'none';
    scoreContainer.style.display = 'none';
    speedContainer.style.display = 'none';
    const finalScore = backdrop.querySelector('.finish-text span');
    const currentScore = score.innerHTML;
    finalScore.innerText = currentScore;
  }

  button.addEventListener('click', () => {
    isPause = !isPause;
    if (isPause) {
      cancelAnimationFrame(animationId);
      cancelAnimationFrame(carInfo.move.top);
      cancelAnimationFrame(carInfo.move.bottom);
      cancelAnimationFrame(carInfo.move.left);
      cancelAnimationFrame(carInfo.move.right);
      button.children[0].style.display = 'none';
      button.children[1].style.display = 'block';
    } else {
      requestAnimationFrame(startGame);
      button.children[0].style.display = 'block';
      button.children[1].style.display = 'none';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (isPause) {
      return;
    }
    if (e.code === 'ArrowUp' && carInfo.move.top === null) {
      if (carInfo.move.bottom !== null) {
        return;
      }
      carInfo.move.top = requestAnimationFrame(carMoveToTop);
    } else if (e.code === 'ArrowDown' && carInfo.move.bottom === null) {
      if (carInfo.move.top !== null) {
        return;
      }
      carInfo.move.bottom = requestAnimationFrame(carMoveToBottom);
    } else if (e.code === 'ArrowLeft' && carInfo.move.left === null) {
      if (carInfo.move.right !== null) {
        return;
      }
      carInfo.move.left = requestAnimationFrame(carMoveToLeft);
    } else if (e.code === 'ArrowRight' && carInfo.move.right === null) {
      if (carInfo.move.left !== null) {
        return;
      }
      carInfo.move.right = requestAnimationFrame(carMoveToRight);
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowUp') {
      cancelAnimationFrame(carInfo.move.top);
      carInfo.move.top = null;
    } else if (e.code === 'ArrowDown') {
      cancelAnimationFrame(carInfo.move.bottom);
      carInfo.move.bottom = null;
    } else if (e.code === 'ArrowLeft') {
      cancelAnimationFrame(carInfo.move.left);
      carInfo.move.left = null;
    } else if (e.code === 'ArrowRight') {
      cancelAnimationFrame(carInfo.move.right);
      carInfo.move.right = null;
    }
  });

  function carMoveToTop() {
    const newCoordinateY = carInfo.coordinates.y - 5;
    if (newCoordinateY < 0) {
      return;
    }
    carInfo.coordinates.y = newCoordinateY;
    car.style.transform = `translate(${carInfo.coordinates.x}px, ${carInfo.coordinates.y}px)`;
    carInfo.move.top = requestAnimationFrame(carMoveToTop);
  }

  function carMoveToBottom() {
    const newCoordinateY = carInfo.coordinates.y + 5;
    if (newCoordinateY > road.clientHeight - car.clientHeight) {
      return;
    }
    carInfo.coordinates.y = newCoordinateY;
    car.style.transform = `translate(${carInfo.coordinates.x}px, ${carInfo.coordinates.y}px)`;
    carInfo.move.bottom = requestAnimationFrame(carMoveToBottom);
  }

  function hasCollision(element1, element2) {
    const carYTop = element1.coordinates.y;
    const carYBottom = element1.coordinates.y + element1.height;
    const carXLeft = element1.coordinates.x - element1.width / 2;
    const carXRight = element1.coordinates.x + element1.width / 2;

    const coinYTop = element2.coordinates.y;
    const coinYBottom = element2.coordinates.y + element2.height;
    const coinXLeft = element2.coordinates.x - element2.width / 2;
    const coinXRight = element2.coordinates.x + element2.width / 2;

    if (carYTop > coinYBottom || carYBottom < coinYTop) {
      return false;
    }
    if (carXLeft > coinXRight || carXRight < coinXLeft) {
      return false;
    }
    return true;
  }

  function carMoveToLeft() {
    const newCoordinateX = carInfo.coordinates.x - 5;
    if (newCoordinateX < -road.clientWidth / 2 + car.clientWidth / 2) {
      return;
    }
    carInfo.coordinates.x = newCoordinateX;
    car.style.transform = `translate(${carInfo.coordinates.x}px, ${carInfo.coordinates.y}px)`;
    carInfo.move.left = requestAnimationFrame(carMoveToLeft);
  }

  function carMoveToRight() {
    const newCoordinateX = carInfo.coordinates.x + 5;
    if (newCoordinateX >= road.clientWidth / 2 - car.clientWidth / 2) {
      return;
    }
    carInfo.coordinates.x = newCoordinateX;
    car.style.transform = `translate(${carInfo.coordinates.x}px, ${carInfo.coordinates.y}px)`;
    carInfo.move.right = requestAnimationFrame(carMoveToRight);
  }

  restartButton.addEventListener('click', () => {
    window.location.reload();
  });
})();
