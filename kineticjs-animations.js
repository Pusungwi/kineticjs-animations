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

//blink (required fade)
function blinkAnimation(targetLayer, targetShape, period, cyclePeriod, endFunc) {
  var opacityValue = 0.0;
  var cycleCount = 1;
  var anim = new Kinetic.Animation(function(frame) {
    var realCyclePeriod = cycleCount * cyclePeriod;
    if (frame.time < period) {
      if (frame.time >= realCyclePeriod) {
        cycleCount++;
        targetShape.setOpacity(opacityValue);
        if (opacityValue == 0.0) {
          opacityValue = 1.0;
        } else {
          opacityValue = 0.0;
        }
      }
    } else {
      targetShape.setOpacity(1.0);
      this.stop();
      if (endFunc !== null) {
        endFunc();
      }
    }
  }, targetLayer);
  anim.start();
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

function rotateByAnimation(targetLayer, targetShape, dstRotate, period, endFunc) {
  var animBeforeDeg = targetShape.getRotationDeg(); 
  var isAlreadyReached = false;

  var anim = new Kinetic.Animation(function(frame) {
    var movedDeg = (dstRotate / period) * frame.time;
    targetShape.rotateDeg(movedDeg);

    var currentShapeDeg = targetShape.getRotationDeg();
    if (dstRotate > 0) {
      if (currentShapeDeg >= animBeforeDeg+dstRotate) {
        isAlreadyReached = true;
      }
    } else {
      if (currentShapeDeg <= animBeforeDeg+dstRotate) {
        isAlreadyReached = true;
      }
    }
    if (isAlreadyReached == true) {
      targetShape.rotateDeg((animBeforeDeg+dstRotate)-currentShapeDeg);
      this.stop();
      if (endFunc !== null) {
        endFunc();
      }
    }
  }, layer);

  anim.start();
}

function rotateToAnimation(targetLayer, targetShape, dstRotate, period, endFunc) {
  var currentShapeDeg = targetShape.getRotationDeg();
  rotateByAnimation(targetLayer, targetShape, dstRotate-currentShapeDeg, period, endFunc);
}

// move
function moveToXAnimation(targetLayer, targetShape, targetX, period, endFunc) {
  var shapeX = targetShape.getX();

  var anim = new Kinetic.Animation(function(frame) {
    var frameX = (targetX-shapeX) * (frame.time / period);
    var newX = shapeX + frameX;
    var isAlreadyReached = false;

    if (frameX >= 0) {
      if (newX >= targetX) {
        newX = targetX;
        isAlreadyReached = true;

      }
    } else {
      if (newX <= targetX) {
        newX = targetX;
        isAlreadyReached = true;
      }
    }
    targetShape.setX(newX);

    if (isAlreadyReached == true) {
      this.stop();
      if (endFunc !== null) {
        endFunc();
      }
    }
  }, targetLayer);

  anim.start();
}

function moveToYAnimation(targetLayer, targetShape, targetY, period, endFunc) {
  var shapeY = targetShape.getY();

  var anim = new Kinetic.Animation(function(frame) {
    var frameY = (targetY-shapeY) * (frame.time / period);
    var newY = shapeY + frameY;
    var isAlreadyReached = false;

    console.log("new", frameY, newY);

    if (frameY >= 0) {
      if (newY >= targetY) {
        newY = targetY;
        isAlreadyReached = true;
      }
    } else {
      if (newY <= targetY) {
        newY = targetY;
        isAlreadyReached = true;
      }
    }
    targetShape.setY(newY);

    if (isAlreadyReached == true) {
      this.stop();
      if (endFunc !== null) {
        endFunc();
      }
    }
  }, targetLayer);

  anim.start();
}

function moveToAnimation(targetLayer, targetShape, targetX, targetY, period, endFunc) {
  moveToXAnimation(targetLayer, targetShape, targetX, period, endFunc);
  moveToYAnimation(targetLayer, targetShape, targetY, period, endFunc);
}

function moveByAnimation(targetLayer, targetShape, targetX, targetY, period, endFunc) {
  moveByXAnimation(targetLayer, targetShape, targetX, period, endFunc);
  moveByYAnimation(targetLayer, targetShape, targetY, period, endFunc);
}