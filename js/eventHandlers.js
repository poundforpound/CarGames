import { button, car, road, restartButton } from './constants.js';
import {
  startGame,
  finishGame,
  carInfo,
  coinInfo,
  arrowInfo,
  dangerInfo,
  animationId,
} from './gameLogic.js';

let isPause = false;

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
