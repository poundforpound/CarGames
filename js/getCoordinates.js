export function getCoordinate(element) {
  const matrix = window.getComputedStyle(element).transform;
  const matrixArray = matrix.split(',');
  const coordinateY = parseFloat(matrixArray[matrixArray.length - 1]);
  const coordinateX = parseFloat(matrixArray[matrixArray.length - 2]);
  return { x: coordinateX, y: coordinateY };
}
