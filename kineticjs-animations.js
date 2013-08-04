// KineticJS-Animations
// KineticJS-Animations.js
// Copyright 2013 @ Yi 'Pusungwi' Yeon Jae
// See LICENSE and README.md

// fade in/out/to animations
function fadeToAnimation(targetLayer, targetShape, period, dstOpacity, endFunc) {
  var FADE_TO_MAX_VALUE = 1.0;
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
  console.log("running fadeIn...")
  fadeToAnimation(targetLayer, targetShape, period, 1.0, endFunc);
}

function fadeOutAnimation(targetLayer, targetShape, period, endFunc) {
  fadeToAnimation(targetLayer, targetShape, period, 0.0, endFunc);
}

//zoom in/out/to animations
function insertCenterScale(targetShape) {
  if (targetShape.cx == null) {
    //set new center scale method
    targetShape.cx=targetShape.getX()+targetShape.getWidth()/2;
    targetShape.cy=targetShape.getY()+targetShape.getHeight()/2;
    // custom scale function to both
    // scale the group and center the results
    targetShape.setCenterScale=function(x,y){
      targetShape.setScale(x,y);
      targetShape.setPosition(
        targetShape.cx-targetShape.getWidth()/2*targetShape.getScale().x,
        targetShape.cy-targetShape.getHeight()/2*targetShape.getScale().y);
      targetShape.draw();
    }
  }
}

function zoomInAnimation(targetLayer, targetShape, dstScale, period, endFunc) {
  insertCenterScale(targetShape);
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
  }, targetLayer);
  anim.start();
}

function zoomOutAnimation(targetLayer, targetShape, dstScale, period, endFunc) {
  insertCenterScale(targetShape);
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
  }, targetLayer);
  anim.start();
}

function zoomToAnimation(targetLayer, targetShape, dstScale, period, endFunc) {
  var currentShapeScale = targetShape.getScale();
  if (dstScale >= currentShapeScale.x) {
    zoomInAnimation(targetLayer, targetShape, dstScale, period, endFunc);
  } else {
    zoomOutAnimation(targetLayer, targetShape, dstScale, period, endFunc);
  }
}

// rotate
function rotateToFunction(targetLayer, targetShape, dstDegree, period, endFunc) {
  // one revolution per 4 seconds
  var angularSpeed = 1000;
  var anim = new Kinetic.Animation(function(frame) {
    var angularSpeed = Math.PI / 2;
    var angleDiff = frame.timeDiff * angularSpeed / 1000;
    targetShape.rotate(angleDiff);
  }, layer);

  anim.start();
}

// move
function moveToFunction(targetLayer, targetShape, targetX, targetY, period, endFunc) {
  var shapeX = targetShape.getX();
  var shapeY = targetShape.getY();

  var anim = new Kinetic.Animation(function(frame) {
    var newX = (targetX-shapeX) * (frame.time / period) + shapeX;
    var newY = (targetY-shapeY) * (frame.time / period) + shapeY;

    
    if (newX >= targetX) {
      newX = targetX;
    }
    targetShape.setX(newX);
    
    if (newY >= targetY) {
      newY = targetY;
    }
    targetShape.setY(newY);

    if (newX >= targetX && newY >= targetY) {
      this.stop();
    }
  }, layer);

  anim.start();
}