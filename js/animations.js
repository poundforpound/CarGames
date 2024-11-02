import { allTrees, biggestTree } from './gameLogic.js';
import { road } from './constants.js';

export function animationTrees(speed) {
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

export function elementAnimation(speed, elementInfo, element, isWaiting) {
  let newCoordinateY = elementInfo.coordinates.y + speed;
  let newCoordinateX = elementInfo.coordinates.x;
  if (newCoordinateY > window.innerHeight) {
    newCoordinateY = -element.clientHeight * 2;
    const direction = Math.floor(Math.random() * 2);
    const randomX = parseFloat(Math.random() * (road.clientWidth / 2 - element.clientWidth / 2));
    newCoordinateX = direction === 0 ? -randomX : randomX;
    if (!isWaiting) {
      element.style.display = 'initial';
      elementInfo.visible = true;
    }
  }
  elementInfo.coordinates.y = newCoordinateY;
  elementInfo.coordinates.x = newCoordinateX;
  element.style.transform = `translate(${elementInfo.coordinates.x}px, ${elementInfo.coordinates.y}px)`;
}
