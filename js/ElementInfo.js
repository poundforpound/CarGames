import { getCoordinate } from './getCoordinates.js';

export class ElementInfo {
  constructor(element, move = {}) {
    this.element = element;
    this.coordinates = getCoordinate(element);
    this.width = element.clientWidth;
    this.height = element.clientHeight;
    this.visible = true;
    this.move = move;
  }
}
