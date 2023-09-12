import Controller from './Controller';

const controller = new Controller(document.querySelector('.column'));
controller.init();

document.body.addEventListener('mousedown', controller.onMouseDown);
document.body.addEventListener('mouseup', controller.onMouseUp);
document.body.addEventListener('mousemove', controller.onMouseMove);
