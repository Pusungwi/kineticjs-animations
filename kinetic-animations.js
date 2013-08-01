// KineticJS-Animations
// KineticJS-Animations.js
// Copyright 2013 @ Yi 'Pusungwi' Yeon Jae
// See LICENSE and README.md

var FADE_TO_MAX_VALUE = 1.0;

// fade in/out/to animations
function fadeToAnimation(targetLayer, targetShape, period, dstOpacity, endFunc) {
  var currentShapeOpacity = targetShape.getOpacity();
  var isFadeIn = null;
  if (currentShapeOpacity <= dstOpacity) {
    isFadeIn = true;
  } else {
    isFadeIn = false;
  }

  var anim = new Kinetic.Animation(function(frame) {
    var opacity = null;
    if (isFadeIn == true) {
      opacity = currentShapeOpacity + (FADE_TO_MAX_VALUE * (frame.time / period));
      if (opacity >= dstOpacity) {
        opacity = dstOpacity;
        this.stop();
        if (endFunc !== null) {
          endFunc();
        }
      }
    } else {
      opacity = currentShapeOpacity - (FADE_TO_MAX_VALUE * (frame.time / period));
      if (opacity <= dstOpacity) {
        opacity = dstOpacity;
        this.stop();
        if (endFunc !== null) {
          endFunc();
        }
      }
    }
    targetShape.setOpacity(opacity);
  }, targetLayer);
  anim.start();
}

function fadeInAnimation(targetLayer, targetShape, period, endFunc) {
  fadeToAnimation(targetLayer, targetShape, period, 1.0, endFunc);
}

function fadeOutAnimation(targetLayer, targetShape, period, endFunc) {
  fadeToAnimation(targetLayer, targetShape, period, 0.0, endFunc);
}

//zoom in/out/to animations
function zoomOutAnimation(targetLayer, targetShape, dstScale, endFunc) {
  var currentShapeScale = targetShape.getScale();
  var anim = new Kinetic.Animation(function(frame) {
    var scale = currentShapeScale.x - (dstScale * (frame.time / period));
    if (scale <= dstScale) {
      scale = dstScale;
      this.stop();
      if (endFunc !== null) {
        endFunc();
      }
    }
    targetShape.setCenterScale(scale, scale);
  }, rectLayer);
  anim.start();
}

function zoomInAnimation(targetLayer, targetShape, dstScale, endFunc) {
  var currentShapeScale = targetShape.getScale();
  var anim = new Kinetic.Animation(function(frame) {
    var scale = currentShapeScale.x + (dstScale * (frame.time / period));
    if (scale >= dstScale) {
      scale = dstScale;
      this.stop();
      if (endFunc !== null) {
        endFunc();
      }
    }
    targetShape.setCenterScale(scale, scale);
  }, rectLayer);
  anim.start();
}

function zoomToAnimation(targetLayer, targetShape, dstScale, endFunc) {
  var currentShapeScale = targetShape.getScale();
  if (currentShapeScale >= dstScale) {
    zoomInAnimation(targetLayer, targetShape, dstScale, endFunc);
  } else {
    zoomOutAnimation(targetLayer, targetShape, dstScale, endFunc);
  }
}

//rotate
function rotateToFunction(targetLayer, targetShape, dstDegree, endFunc) {
  // one revolution per 4 seconds
  var anim = new Kinetic.Animation(function(frame) {
    var angularSpeed = Math.PI / 2;
    var anim = new Kinetic.Animation(function(frame) {
    var angleDiff = frame.timeDiff * angularSpeed / 1000;
    blueRect.rotate(angleDiff);
    yellowRect.rotate(angleDiff);
    redRect.rotate(angleDiff);
  }, layer);

  anim.start();
}

//move
function moveToFunction(targetLayer, targetShape, targetX, targetY, period, endFunc) {
  var shapeX = targetShape.getX();
  var shapeY = targetShape.getY();

  var anim = new Kinetic.Animation(function(frame) {
    targetShape.setX((targetX-shapeX) * (frame.time / period) + shapeX);
    targetShape.setY((targetY-shapeY) * (frame.time / period) + shapeY);
  }, layer);

  anim.start();
}