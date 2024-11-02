import {
  button,
  road,
  car,
  coin,
  arrow,
  danger,
  trees,
  score,
  speedInput,
  backdrop,
  scoreContainer,
  speedContainer,
  restartButton,
} from './constants.js';
import { ElementInfo } from './ElementInfo.js';
import { getCoordinate } from './getCoordinates.js';
import { animationTrees, elementAnimation } from './animations.js';

let isPause = false;
let animationId = null;
let speed = 3; // Инициализация глобальной переменной speed
let isWaiting = false; // Флаг для управления состоянием ожидания

const allTrees = [];

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
  const coordinates = getCoordinate(el);
  allTrees.push({ element: el, coordinates });
});

export const biggestTree = allTrees.reduce((acc, el) => {
  if (el.element.clientHeight > acc) {
    return el.element.clientHeight;
  }
  return acc;
}, 0);

export function startGame() {
  animationId = requestAnimationFrame(startGame);
  if (!isWaiting && hasCollision(carInfo, dangerInfo)) {
    return finishGame();
  }
  speed = parseFloat(speedInput.value); // Обновление глобальной переменной speed
  animationTrees(speed);
  elementAnimation(speed, coinInfo, coin, isWaiting);
  elementAnimation(speed, dangerInfo, danger, isWaiting);
  if (coinInfo.visible && hasCollision(carInfo, coinInfo)) {
    coin.style.display = 'none';
    score.innerHTML = parseInt(score.innerHTML) + 1;
    coinInfo.visible = false;
    if (parseInt(score.innerHTML) % 2 === 0) {
      speed += 1;
      speedInput.value = speed;
    }
  }
  elementAnimation(speed, arrowInfo, arrow, isWaiting);
  if (arrowInfo.visible && hasCollision(carInfo, arrowInfo)) {
    arrow.style.display = 'none';
    arrowInfo.visible = false;
    danger.style.opacity = 0.2;
    dangerInfo.visible = false;
    speedInput.value = speed + 5;
    isWaiting = true;
    setTimeout(() => {
      danger.style.opacity = 1;
      dangerInfo.visible = true;
      isWaiting = false;
    }, 3000);
  }
}

export function finishGame() {
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

export function hasCollision(element1, element2) {
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

export { carInfo, coinInfo, arrowInfo, dangerInfo, allTrees, animationId };
