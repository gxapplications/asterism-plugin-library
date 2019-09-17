'use strict';

/*
Inspired from jquery.percentageloader.js
Copyright (c) 2012, Better2Web
All rights reserved.
This jQuery plugin is licensed under the Simplified BSD License. Please
see the file license.txt that was included with the plugin bundle.
*/

const init = function ($, window) {
  /* jslint browser: true */

  /* Spiral gradient data */
  const imgdata = 'data:image/png;base64,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';
  const gradient = window.document.createElement('img');
  gradient.src = imgdata;

  /** Percentage loader
   * @param    params    Specify options in {}. May be on of width, height, progress or value.
   */
  $.fn.percentageLoader = function (params) {
    var settings, canvas, percentageText, valueText, items, item, selectors, s, ctx, progress, degress,
      value, cX, cY, lingrad, innerGrad, innerGradOn, tubeGrad, innerRadius, innerBarRadius, outerBarRadius,
      knobRadius, radius, startAngle, endAngle, completeAngle1, completeAngle2, setProgress, setDegress, setValue,
      applyAngle, drawLoader, clipValue, outerDiv, innerBarRadius2, outerBarRadius2, ledOnGrad, ledOffGrad,
      startAngleLed, setCenter, startAngleLed2, endAngleLed2, innerBarRadius3, outerBarRadius3, innerGradOff,
      endAngleLed, progressLabel, degressLabel, mouseDown1, mouseDown2, mouseDown3, getDayWithXY, setLedStates;
    var ledModifyingStart = false;
    var ledModifyingState = false;
    var ledModifyingEnd = false;

    /* Specify default settings */
    settings = {
      width: 256,
      height: 256,
      degress: 0,
      progress: 1,
      scaleOffset: 0.0,
      scaleAmplitude: 100.0,
      value: 'Progress',
      suffix: '',
      centerState: false,
      precision: 0,
      controllable: false,
      ledCount: 24,
      ledLabelCount: 24,
      ledLabelOffset: 0,
      ledStates: Array(24).fill(1),
      currentLed: 0,
      currentDay: -1,
      today: -1
    };

    /* Override default settings with provided params, if any */
    if (params !== undefined) {
      $.extend(settings, params);
    } else {
      params = settings;
    }

    /* Fix ledStates if needed */
    var newLedStates = [];
    for (var i = 0; i < settings.ledCount; i++) {
      newLedStates[i] = settings.ledStates[i] || 0;
    }
    settings.ledStates = newLedStates;

    outerDiv = window.document.createElement('div');
    outerDiv.style.width = settings.width + 'px';
    outerDiv.style.height = settings.height + 'px';
    outerDiv.style.position = 'relative';
    outerDiv.style.left = (($(this).width() - settings.width) / 2) + 'px';
    outerDiv.style.cursor = 'default';
    $(outerDiv).addClass('temperatureShadow');
    $(this).append(outerDiv);

    /* Create our canvas object */
    canvas = window.document.createElement('canvas');
    canvas.setAttribute('width', settings.width);
    canvas.setAttribute('height', settings.height);
    outerDiv.appendChild(canvas);

    /* Create div elements we'll use for text. Drawing text is
     * possible with canvas but it is tricky working with custom
     * fonts as it is hard to guarantee when they become available
     * with differences between browsers. DOM is a safer bet here */
    percentageText = window.document.createElement('div');
    percentageText.style.width = (settings.width - 2) + 'px';
    percentageText.style.textAlign = 'center';
    percentageText.style.height = (settings.width * 0.4) + 'px';
    percentageText.style.left = 0;
    percentageText.style.position = 'absolute';

    valueText = window.document.createElement('div');
    valueText.style.width = (settings.width - 2) + 'px';
    valueText.style.textAlign = 'center';
    valueText.style.height = '0px';
    valueText.style.overflow = 'hidden';
    valueText.style.left = 0;
    valueText.style.position = 'absolute';

    /* Force text items to not allow selection */
    items = [valueText, percentageText];
    for (i = 0; i < items.length; i += 1) {
      item = items[i];
      selectors = [
        '-webkit-user-select',
        '-khtml-user-select',
        '-moz-user-select',
        '-o-user-select',
        'user-select'];

      for (s = 0; s < selectors.length; s += 1) {
        $(item).css(selectors[s], 'none');
      }
    }

    /* Add the new dom elements to the containing div */
    outerDiv.appendChild(percentageText);
    outerDiv.appendChild(valueText);

    /* Get a reference to the context of our canvas object */
    ctx = canvas.getContext("2d");

    /* Set various initial values */

    /* Centre point */
    cX = (canvas.width / 2) - 1;
    cY = (canvas.height / 2) - 1;

    /* Create our linear gradient for the outer ring */
    lingrad = ctx.createLinearGradient(cX, 0, cX, canvas.height);
    lingrad.addColorStop(0, '#9E9E9E'); // 500
    lingrad.addColorStop(1, '#616161'); // 700

    /* Create inner gradient for the outer ring */
    innerGrad = ctx.createLinearGradient(cX, cX * 0.133333, cX, canvas.height - cX * 0.133333);
    innerGrad.addColorStop(0, '#616161'); // 700
    innerGrad.addColorStop(1, '#323232'); // 850 ?
    innerGradOn = ctx.createLinearGradient(cX, cX * 0.133333, cX, canvas.height - cX * 0.133333);
    innerGradOn.addColorStop(0, '#1DE9B6'); // A400
    innerGradOn.addColorStop(1, '#00897B'); // 600
    innerGradOff = ctx.createLinearGradient(cX, cX * 0.133333, cX, canvas.height - cX * 0.133333);
    innerGradOff.addColorStop(0, '#00695C'); // 800
    innerGradOff.addColorStop(1, '#004D40'); // 900

    /* Tube gradient (background, not the spiral gradient) */
    tubeGrad = ctx.createLinearGradient(cX, 0, cX, canvas.height);
    tubeGrad.addColorStop(0, '#616161'); // 700
    tubeGrad.addColorStop(1, '#323232'); // 850 ?

    /* Led gradient */
    ledOnGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    ledOnGrad.addColorStop(0, '#1DE9B6'); // A400
    ledOnGrad.addColorStop(1, '#00897B'); // 600
    ledOffGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    ledOffGrad.addColorStop(0, '#00695C'); // 800
    ledOffGrad.addColorStop(1, '#004D40'); // 900

    /* The inner circle is 2/3rds the size of the outer one */
    innerRadius = cX * 0.34;
    /* Outer radius is the same as the width / 2, same as the centre x
    * (but we leave a little room so the borders aren't truncated) */
    radius = cX;

    /* Calculate the radii of the inner tube */
    innerBarRadius = innerRadius + (cX * 0.10);
    outerBarRadius = (innerBarRadius + radius) / 2 - (cX * 0.10);
    knobRadius = (innerBarRadius + outerBarRadius) / 2;

    /* Second inner tube (planer) */
    innerBarRadius2 = (innerBarRadius + radius) / 2 + (cX * 0.01);
    outerBarRadius2 = radius - (cX * 0.14);

    /* Second inner tube (days) */
    innerBarRadius3 = (innerBarRadius + radius) / 2 + (cX * 0.15);
    outerBarRadius3 = radius - (cX * 0.02);

    /* Bottom left angle */
    startAngle = 2.1707963267949 + 0.9707963267949 / 3;
    startAngleLed = 2.1707963267949 + 0.9707963267949 / 9;
    /* Bottom right angle */
    endAngle = 0.9707963267949 - (0.9707963267949 / 3) + (Math.PI * 2.0);
    endAngleLed = 0.9707963267949 - (0.9707963267949 / 9) + (Math.PI * 2.0);

    startAngleLed2 = 2.1707963267949 - (0.9707963267949 * 1.2);
    endAngleLed2 = 0.9707963267949 + (0.9707963267949 / 0.65) + (Math.PI * 2.0);

    /* Borders should be 1px */
    ctx.lineWidth = 1;

    /**
     * Little helper method for transforming points on a given
     * angle and distance for code clarity
     */
    applyAngle = function (point, angle, distance) {
      return {
        x: point.x + (Math.cos(angle) * distance),
        y: point.y + (Math.sin(angle) * distance)
      };
    };

    /**
     * render the widget in its entirety.
     */
    drawLoader = function () {
      /* Clear canvas entirely */
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /*** IMAGERY ***/

      /* draw outer circle */
      ctx.fillStyle = lingrad;
      ctx.beginPath();
      ctx.strokeStyle = '#424242'; // 800
      ctx.arc(cX, cY, radius - 1.5, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.stroke();

      /* draw inner circle */
      ctx.fillStyle = settings.centerState ? innerGradOn : innerGradOff;
      ctx.beginPath();
      ctx.arc(cX, cY, innerRadius, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();

      /**
       * Helper function - adds a path (without calls to beginPath or closePath)
       * to the context which describes the inner tube. We use this for drawing
       * the background of the inner tube (which is always at 100%) and the
       * progress meter itself, which may vary from 0-100% */
      function makeInnerTubePath(startAngle, endAngle, innerBarRadius, outerBarRadius, capLength = 0) {
        var centrePoint, startPoint, controlAngle, c1, c2, point1, point2;
        centrePoint = {
          x: cX,
          y: cY
        };

        startPoint = applyAngle(centrePoint, startAngle, innerBarRadius);

        ctx.moveTo(startPoint.x, startPoint.y);

        point1 = applyAngle(centrePoint, endAngle, innerBarRadius);
        point2 = applyAngle(centrePoint, endAngle, outerBarRadius);

        controlAngle = endAngle + (3.142 / 2.0);
        /* Cap length - a fifth of the canvas size minus 4 pixels */
        capLength = capLength || (cX * 0.20) - 4;

        c1 = applyAngle(point1, controlAngle, capLength);
        c2 = applyAngle(point2, controlAngle, capLength);

        ctx.arc(cX, cY, innerBarRadius, startAngle, endAngle, false);
        ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, point2.x, point2.y);
        ctx.arc(cX, cY, outerBarRadius, endAngle, startAngle, true);

        point1 = applyAngle(centrePoint, startAngle, innerBarRadius);
        point2 = applyAngle(centrePoint, startAngle, outerBarRadius);

        controlAngle = startAngle - (3.142 / 2.0);

        c1 = applyAngle(point2, controlAngle, capLength);
        c2 = applyAngle(point1, controlAngle, capLength);

        ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, point1.x, point1.y);

        return [c1.x, c1.y, c2.x, c2.y, point1.x, point1.y];
      }

      /* Background tube */
      ctx.beginPath();
      ctx.strokeStyle = '#757575cc'; // 600 + alpha
      makeInnerTubePath(startAngle, endAngle, innerBarRadius, outerBarRadius);
      ctx.fillStyle = tubeGrad;
      ctx.fill();
      ctx.stroke();

      /* Background tube 2 */
      ctx.beginPath();
      ctx.strokeStyle = '#757575cc'; // 600 + alpha
      makeInnerTubePath(startAngleLed, endAngleLed, innerBarRadius2, outerBarRadius2, 3);
      ctx.fillStyle = tubeGrad;
      ctx.fill();
      ctx.stroke();

      /* Background tube 3 */
      {
        var angleInterval = endAngleLed2 - startAngleLed2;
        var ledAngleAmplitude = angleInterval / 48;
        var ledStartAngle = startAngleLed2;
        var ledEndAngle = startAngleLed2 + (7 * ledAngleAmplitude);
        ctx.beginPath();
        ctx.strokeStyle = '#757575cc'; // 600 + alpha
        makeInnerTubePath(ledStartAngle, ledEndAngle, innerBarRadius3, outerBarRadius3, 3);
        ctx.fillStyle = tubeGrad;
        ctx.fill();
        ctx.stroke();
      }

      /* Calculate angles for the the progress metre */
      completeAngle2 = startAngle + (progress * (endAngle - startAngle));
      completeAngle1 = startAngle + (degress * (endAngle - startAngle));

      ctx.beginPath();
      makeInnerTubePath(completeAngle1, completeAngle2, innerBarRadius, outerBarRadius);

      /* We're going to apply a clip so save the current state */
      ctx.save();
      /* Clip so we can apply the image gradient */
      ctx.clip();

      /* Draw the spiral gradient over the clipped area */
      ctx.scale(-1, 1);
      ctx.drawImage(gradient, canvas.width * -1, 0, canvas.width, canvas.height);

      /* Undo the clip */
      ctx.restore();

      /* Draw the outline of the path */
      ctx.beginPath();
      makeInnerTubePath(completeAngle1, completeAngle2, innerBarRadius, outerBarRadius);
      ctx.stroke();

      /* draw planer leds */
      function drawLed(position, isOn, label) {
        var angleInterval = endAngleLed - startAngleLed;
        var ledAngleAmplitude = angleInterval / settings.ledCount;
        var ledAngleMargin = ledAngleAmplitude * 0.31;
        var ledStartAngle = startAngleLed + (position * ledAngleAmplitude) + (ledAngleMargin / 2);
        var ledEndAngle = ledStartAngle + ledAngleAmplitude - ledAngleMargin;
        var ledRadiusMargin = (outerBarRadius2 - innerBarRadius2) * 0.08

        ctx.strokeStyle = '#f50000ee';
        ctx.fillStyle = isOn ? ledOnGrad : ledOffGrad;
        ctx.beginPath();
        var coords = makeInnerTubePath(ledStartAngle, ledEndAngle, innerBarRadius2 + ledRadiusMargin, outerBarRadius2 - ledRadiusMargin, 1);
        ctx.fill();
        if (position === settings.currentLed) {
          ctx.stroke();
        }

        if (label !== undefined) {
          ctx.save();
          ctx.translate(cX, cY);
          ctx.font = (cX / 15) + 'px sans-serif, Arial';
          var textSize = ctx.measureText(label).width / 2;
          if (position < settings.ledCount / 2) { // left part
            ctx.rotate(ledEndAngle + Math.PI - Math.PI / 51); // Fine tuning
            ctx.translate(-innerBarRadius2 * 1.09 - textSize, 0.5);
          } else { // right part
            ctx.rotate(ledEndAngle - Math.PI / 350); // Fine tuning
            ctx.translate(innerBarRadius2 * 1.09 - textSize, 0.5);
          }
          ctx.fillStyle = isOn ? '#004D40' : '#1DE9B6';
          ctx.fillText(label, 0, 0);
          ctx.restore();
        }
      }

      for (var i = 0; i < settings.ledCount; i++) {
        let label = i * (settings.ledLabelCount / settings.ledCount) + settings.ledLabelOffset;
        label = (Math.floor(label) === label) ? label : undefined;
        if (ledModifyingStart !== false && (
          (i >= ledModifyingStart && i <= ledModifyingEnd) ||
          (i >= ledModifyingEnd && i <= ledModifyingStart)
        )) {
          drawLed(i, ledModifyingState, label);
        } else {
          drawLed(i, settings.ledStates[i] === 1, label);
        }
      }

      /* draw days leds */
      function drawLed2(position, isOn, label) {
        var angleInterval = endAngleLed2 - startAngleLed2;
        var ledAngleAmplitude = angleInterval / 48;
        var ledAngleMargin = ledAngleAmplitude * 0.2;
        var ledStartAngle = startAngleLed2 + (position * ledAngleAmplitude) + (ledAngleMargin / 2);
        var ledEndAngle = ledStartAngle + ledAngleAmplitude - ledAngleMargin;
        var ledRadiusMargin = (outerBarRadius2 - innerBarRadius2) * 0.08

        ctx.strokeStyle = '#f50000ee';
        ctx.fillStyle = isOn ? ledOnGrad : ledOffGrad;
        ctx.beginPath();
        var coords = makeInnerTubePath(ledStartAngle, ledEndAngle, innerBarRadius3 + ledRadiusMargin, outerBarRadius3 - ledRadiusMargin, 1);
        ctx.fill();
        if ((7 - position) === settings.today || (position === 0 && position === settings.today)) {
          ctx.stroke();
        }

        if (label !== undefined) {
          ctx.save();
          ctx.translate(cX, cY);
          ctx.font = (cX / 15) + 'px Roboto, sans-serif, Arial';
          var textSize = ctx.measureText(label).width;
          ctx.rotate(ledEndAngle + Math.PI - Math.PI / 41 + Math.PI / 2); // Fine tuning
          ctx.translate(-textSize * 0.65, innerBarRadius3 * 1.09);
          ctx.fillStyle = isOn ? '#004D40' : '#1DE9B6';
          ctx.fillText(label, 0, 0);
          ctx.restore();
        }
      }

      for (var i = 0; i < 7; i++) {
        const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
        var label = days[6 - i];
        drawLed2(i, ((7 - i) === settings.currentDay % 7) || (i === 0 && i === settings.currentDay % 7), label);
      }

      /* knobs */
      degressLabel = (degress * settings.scaleAmplitude + settings.scaleOffset).toFixed(settings.precision);
      progressLabel = (progress * settings.scaleAmplitude + settings.scaleOffset).toFixed(settings.precision);

      ctx.shadowColor = "rgba(21,21,21,0.4)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 3;

      var knob2X = cX + Math.cos(completeAngle2) * knobRadius,
        knob2Y = cY + Math.sin(completeAngle2) * knobRadius,
        knob1X = cX + Math.cos(completeAngle1) * knobRadius,
        knob1Y = cY + Math.sin(completeAngle1) * knobRadius;
      ctx.fillStyle = ledOffGrad;
      ctx.beginPath();
      ctx.arc(knob1X, knob1Y, (outerBarRadius - innerBarRadius) * 0.79, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.fillStyle = ledOnGrad;
      ctx.beginPath();
      ctx.arc(knob2X, knob2Y, (outerBarRadius - innerBarRadius) * 0.79, 0, Math.PI * 2, false);
      ctx.fill();

      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      /*** TEXT ***/
      (function () {
        var fontSize, string, smallSize, heightRemaining;

        /* Calculate the size of the font based on the canvas size */
        fontSize = cX / 9;

        // knobs labels
        ctx.save();
        ctx.font = 'bold ' + fontSize + 'px sans-serif, Arial';
        ctx.fillStyle = '#ffffff';
        if (!mouseDown1) {
          var textSize = ctx.measureText(degressLabel);
          ctx.fillText(degressLabel, knob1X - textSize.width / 2, knob1Y + fontSize / 3.4);
        }
        if (!mouseDown2) {
          var textSize = ctx.measureText(progressLabel);
          ctx.fillText(progressLabel, knob2X - textSize.width / 2, knob2Y + fontSize / 3.4);
        }
        ctx.restore();

        /* Calculate the text for the progresses */
        percentageText.style.color = '#FFFFFF';
        percentageText.style.fontFamily = 'Roboto, sans-serif, Arial';
        percentageText.style.lineHeight = '1.2em';
        percentageText.style.textShadow = '0 1px 1px #424242';
        if (mouseDown1) {
          percentageText.style.fontSize = (fontSize * 1.8) + 'px';
          percentageText.style.top = (settings.width * 0.42) + 'px';
          string = degressLabel;
        } else if (mouseDown2) {
          percentageText.style.fontSize = (fontSize * 1.8) + 'px';
          percentageText.style.top = (settings.width * 0.42) + 'px';
          string = progressLabel;
        } else {
          percentageText.style.fontSize = fontSize.toString() + 'px';
          percentageText.style.top = (settings.width * 0.39) + 'px';
          string = settings.suffix;
        }
        percentageText.innerHTML = string;

        /* Calculate font and placement of small 'value' text */
        smallSize = cX / 6.5;
        valueText.style.color = '#E0E0E0'; // 300
        valueText.style.fontFamily = 'Roboto, sans-serif, Arial';
        valueText.style.fontSize = smallSize.toString() + 'px';
        valueText.style.lineHeight = '1.2em';
        valueText.style.height = (3 * smallSize).toString() + 'px';
        valueText.style.overflow = 'visible';
        valueText.style.textShadow = '0 1px 1px #424242';
        heightRemaining = (settings.height * 0.30) - smallSize;
        valueText.style.top = ((settings.height * 0.70) + (heightRemaining / 4)).toString() + 'px';
      }());
    };

    /**
     * Check the progress value and ensure it is within the correct bounds [0..1]
     */
    clipValue = function (inverse) {
      if (progress < 0) {
        progress = 0;
      }
      if (progress > 1.0) {
        progress = 1.0;
      }
      if (degress < 0) {
        degress = 0;
      }
      if (degress > 1.0) {
        degress = 1.0;
      }
      if (degress > progress) {
        if (inverse) progress = degress;
        else degress = progress;
      }
    };

    /* Sets the current progress level of the loader
     *
     * @param value the progress value, from 0 to 1. Values outside this range
     * will be clipped
     */
    setProgress = function (value) {
      /* Clip values to the range [0..1] */
      progress = value;
      clipValue(false);
      drawLoader();
    };
    setDegress = function (value) {
      /* Clip values to the range [0..1] */
      degress = value;
      clipValue(true);
      drawLoader();
    };
    this.setProgress = setProgress;
    this.setDegress = setDegress;

    setValue = function (val) {
      value = val;
      valueText.innerHTML = value;
    };
    this.setValue = setValue;
    this.setValue(settings.value);

    setCenter = function (title, state) {
      settings.suffix = title;
      settings.centerState = state;
      drawLoader();
    };
    this.setCenter = setCenter;

    setLedStates = function (states = [], day = -1, today = -1) {
      settings.ledStates = states;
      settings.currentDay = day;
      settings.today = today;
      drawLoader();
    }
    this.setLedStates = setLedStates;

    progress = settings.progress;
    degress = settings.degress;
    clipValue(false);

    /* Do an initial draw */
    drawLoader();

    /* In controllable mode, add event handlers */
    if (params.controllable === true) {
      (function () {
        var getDistance, adjustProgressWithXY, adjustDegressWithXY, getLedWithXY, triggerLedChanged;
        getDistance = function (x1, y1, x2, y2) {
          return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        };

        mouseDown1 = false;
        mouseDown2 = false;
        mouseDown3 = false;

        adjustProgressWithXY = function (x, y) {
          /* within the bar, calculate angle of touch point */
          var pX, pY, angle, startTouchAngle, range, posValue;
          pX = x - cX;
          pY = y - cY;

          angle = Math.atan2(pY, pX);
          if (angle > Math.PI / 2.0) {
              angle -= (Math.PI * 2.0);
          }

          startTouchAngle = startAngle - (Math.PI * 2.0);
          range = endAngle - startAngle;
          posValue = (angle - startTouchAngle) / range;
          var oldDegress = degress;
          setProgress(posValue);

          if (params.onProgressUpdate) {
            /* use the progress value as this will have been clipped
             * to the correct range [0..1] after the call to setProgress
             */
            params.onProgressUpdate(progress);
          }
          if (degress != oldDegress && params.onDegressUpdate) {
            /* use the progress value as this will have been clipped
             * to the correct range [0..1] after the call to setProgress
             */
            params.onDegressUpdate(degress);
          }
          degress = oldDegress;
        };

        adjustDegressWithXY = function (x, y) {
          /* within the bar, calculate angle of touch point */
          var pX, pY, angle, startTouchAngle, range, posValue;
          pX = x - cX;
          pY = y - cY;

          angle = Math.atan2(pY, pX);
          if (angle > Math.PI / 2.0) {
            angle -= (Math.PI * 2.0);
          }

          startTouchAngle = startAngle - (Math.PI * 2.0);
          range = endAngle - startAngle;
          posValue = (angle - startTouchAngle) / range;
          var oldProgress = progress;
          setDegress(posValue);

          if (params.onDegressUpdate) {
            /* use the progress value as this will have been clipped
             * to the correct range [0..1] after the call to setProgress
             */
            params.onDegressUpdate(degress);
          }
          if (progress != oldProgress && params.onProgressUpdate) {
            /* use the progress value as this will have been clipped
             * to the correct range [0..1] after the call to setProgress
             */
            params.onProgressUpdate(progress);
          }
          progress = oldProgress;
        };

        getLedWithXY = function (x, y) {
          /* within the bar, calculate angle of touch point */
          var pX, pY, angle, startTouchAngle, range, posValue;
          pX = x - cX;
          pY = y - cY;

          angle = Math.atan2(pY, pX);
          if (angle > Math.PI / 2.0) {
            angle -= (Math.PI * 2.0);
          }

          startTouchAngle = startAngleLed - (Math.PI * 2.0);
          range = endAngleLed - startAngleLed;
          posValue = (angle - startTouchAngle) / range;

          if (posValue < 0 || posValue > 1) {
            return false; // out of led track
          }

          return Math.floor(posValue * settings.ledCount);
        };

        getDayWithXY = function (x, y) {
          /* within the bar, calculate angle of touch point */
          var pX, pY, angle, startTouchAngle, range, posValue;
          pX = x - cX;
          pY = y - cY;

          angle = Math.atan2(pY, pX);
          if (angle > Math.PI / 2.0) {
            angle -= (Math.PI * 2.0);
          }

          startTouchAngle = startAngleLed2 - (Math.PI * 1.95);
          range = startAngleLed2 - endAngleLed2;
          posValue = (startTouchAngle - angle) / range;

          if (posValue > 0.792 && posValue < 0.810) {
            return 0;
          }
          if (posValue > 0.813 && posValue < 0.831) {
            return 6;
          }
          if (posValue > 0.833 && posValue < 0.851) {
            return 5;
          }
          if (posValue > 0.854 || posValue < 0.061) {
            return 4;
          }
          if (posValue > 0.063 && posValue < 0.081) {
            return 3;
          }
          if (posValue > 0.084 && posValue < 0.102) {
            return 2;
          }
          if (posValue > 0.105 && posValue < 0.124) {
            return 1;
          }

          return false; // out of led track
        };

        triggerLedChanged = function () {
          mouseDown3 = false;
          outerDiv.style.cursor = 'default';

          var newLedStates = settings.ledStates.slice();
          for (var i = Math.min(ledModifyingStart, ledModifyingEnd); i <= Math.max(ledModifyingStart, ledModifyingEnd); i++) {
            newLedStates[i] = ledModifyingState ? 1 : 0;
          }

          if (params.onLedUpdate) {
            params.onLedUpdate(settings.ledStates, newLedStates);
          }

          settings.ledStates = newLedStates;
          ledModifyingStart = false;
          ledModifyingEnd = false;
          drawLoader();
        };

        $(outerDiv).mousedown(function (e) {
          var offset, x, y, distance;
          offset = $(this).offset();
          x = e.pageX - offset.left;
          y = e.pageY - offset.top;

          distance = getDistance(x, y, cX, cY);

          if (distance > innerRadius * 1.05 && distance < 0.9 * (innerBarRadius + radius) / 2) {
            outerDiv.style.cursor = 'move';

            // search for nearest knob
            var centrePoint = {x: cX, y: cY};
            completeAngle2 = startAngle + (progress * (endAngle - startAngle));
            completeAngle1 = startAngle + (degress * (endAngle - startAngle));
            var point2 = applyAngle(centrePoint, completeAngle2, knobRadius),
              point1 = applyAngle(centrePoint, completeAngle1, knobRadius);

            if (getDistance(x, y, point1.x, point1.y) >= getDistance(x, y, point2.x, point2.y)) {
              mouseDown2 = true;
              adjustProgressWithXY(x, y);
            } else {
              mouseDown1 = true;
              adjustDegressWithXY(x, y);
            }
          }
          if (distance < radius * 0.85 && distance > (innerBarRadius + radius) / 2) {
            outerDiv.style.cursor = 'move';
            mouseDown3 = true;
            ledModifyingEnd = ledModifyingStart = getLedWithXY(x, y);
            if (ledModifyingStart !== false) {
              ledModifyingState = (settings.ledStates[ledModifyingStart] === 0);
              drawLoader();
            }
          }
          if (distance < radius * 1.1 && distance > radius * 0.88) {
            const dayTouched = getDayWithXY(x, y);
            if (params.onDayClick && dayTouched !== false) {
              params.onDayClick(dayTouched);
            }
          }

          if (distance <= innerRadius * 0.98) {
            if (params.onCenterClick) {
              params.onCenterClick();
            }
          }
        }).mouseup(function () {
          if (mouseDown1 || mouseDown2) {
            mouseDown1 = false;
            mouseDown2 = false;
            outerDiv.style.cursor = 'default';
            if (params.onKnobRelease) params.onKnobRelease();
            drawLoader();
          }
          if (mouseDown3) {
            triggerLedChanged();
          }
        }).mousemove(function (e) {
          var offset, x, y;
          offset = $(outerDiv).offset();
          x = e.pageX - offset.left;
          y = e.pageY - offset.top;
          if (mouseDown1) {
            adjustDegressWithXY(x, y);
          } else if (mouseDown2) {
            adjustProgressWithXY(x, y);
          } else if (mouseDown3) {
            ledModifyingEnd = getLedWithXY(x, y);
            drawLoader();
          }
        }).mouseleave(function () {
          if (mouseDown1 || mouseDown2) {
            mouseDown1 = false;
            mouseDown2 = false;
            outerDiv.style.cursor = 'default';
            if (params.onKnobRelease) params.onKnobRelease();
            drawLoader();
          }
          if (mouseDown3) {
            triggerLedChanged();
          }
        });
      }());
    }
    return this;
  };

  /** Temperature programmer
   * @param    params    Specify options in {}.
   */
  $.fn.temperatureProgrammer = function (params) {
    var settings, loader, thermostat, setMinValue, setMaxValue, setSize, setTitle, minChanged = false,
      maxChanged = false, oldMinValue, oldMaxValue, setCenter, setLedStates;
    thermostat = $(this);

    /* Specify default settings */
    settings = {
      minValue: 17,
      maxValue: 25,
      scaleOffset: 14.0,
      scaleAmplitude: 18.0,
      title: 'Temperature',
      centerTitle: '°C',
      centerState: false,
      precision: 1,
      onMinUpdate: function (oldValue, newValue, componentData) {
      },
      onMaxUpdate: function (oldValue, newValue, componentData) {
      },
      onCenterClick: function (componentData) {
      },
      onUpdating: function () {
      },
      onPlanerUpdate: function (oldValue, newValue) {
      },
      onDayClick: function (day) {
      },
      componentData: {},
      plannerPrecision: 0.5,
      planner: Array(48).fill(1),
      currentLed: -1,
      currentDay: -1,
      today: -1,
    };

    /* Override default settings with provided params, if any */
    if (params !== undefined) {
      $.extend(settings, params);
    } else {
      params = settings;
    }

    oldMinValue = settings.minValue;
    oldMaxValue = settings.maxValue;

    setMinValue = function (val) {
      settings.minValue = (val - settings.scaleOffset) / settings.scaleAmplitude;
      loader.setDegress(settings.minValue);
    };
    thermostat.setMinValue = setMinValue;

    setMaxValue = function (val) {
      settings.maxValue = (val - settings.scaleOffset) / settings.scaleAmplitude;
      loader.setProgress(settings.maxValue);
    };
    thermostat.setMaxValue = setMaxValue;

    setTitle = function (val) {
      settings.title = val;
      loader.setValue(val);
    };
    thermostat.setTitle = setTitle;

    setCenter = function (title, state = false) {
      settings.centerTitle = title;
      settings.centerState = state;
      loader.setCenter(title, state);
    };
    thermostat.setCenter = setCenter;

    setLedStates = function (states = [], day = -1, today = -1) {
      settings.planer = states;
      settings.currentDay = day;
      settings.today = today;
      loader.setLedStates(states, day, today);
    }
    thermostat.setLedStates = setLedStates;

    setSize = function (size) {
      if (thermostat.children().length > 0) {
        thermostat.html('');
      }
      loader = thermostat.percentageLoader({
        width: size,
        height: size,
        degress: (settings.minValue - settings.scaleOffset) / settings.scaleAmplitude,
        progress: (settings.maxValue - settings.scaleOffset) / settings.scaleAmplitude,
        scaleOffset: settings.scaleOffset,
        scaleAmplitude: settings.scaleAmplitude,
        value: settings.title,
        suffix: settings.centerTitle,
        centerState: settings.centerState,
        precision: settings.precision,
        controllable: true,
        ledCount: 24 / settings.plannerPrecision,
        ledStates: settings.planner,
        currentLed: settings.currentLed,
        currentDay: settings.currentDay,
        today: settings.today,
        onProgressUpdate: function (value) {
          var val2 = (settings.scaleOffset + value * settings.scaleAmplitude).toFixed(settings.precision);
          if (!maxChanged) oldMaxValue = settings.maxValue;
          if (settings.maxValue != val2) {
            settings.maxValue = val2;
            maxChanged = true;
          }
          settings.onUpdating();
        },
        onDegressUpdate: function (value) {
          var val2 = (settings.scaleOffset + value * settings.scaleAmplitude).toFixed(settings.precision);
          if (!minChanged) oldMinValue = settings.minValue;
          if (settings.minValue != val2) {
            settings.minValue = val2;
            minChanged = true;
          }
          settings.onUpdating();
        },
        onCenterClick: function () {
          settings.onCenterClick(settings.componentData);
        },
        onKnobRelease: function () {
          if (maxChanged) {
            settings.onMaxUpdate(oldMaxValue, settings.maxValue, settings.componentData);
            maxChanged = false;
          }
          if (minChanged) {
            settings.onMinUpdate(oldMinValue, settings.minValue, settings.componentData);
            minChanged = false;
          }
        },
        onLedUpdate: function (old, value) {
          settings.onPlanerUpdate(old, value);
          settings.planer = value;
        },
        onDayClick: function (day) {
          settings.onDayClick(day);
        }
      });
    }
    thermostat.setSize = setSize;

    this.resizer = function () {
      var doNow = function () {
        var size = Math.max(180, Math.min(thermostat.width(), thermostat.height()));
        thermostat.setSize(size);
        return true;
      };
      setTimeout(doNow, 150);
      setTimeout(doNow, 400);
      return true;
    };

    this.setTitle = thermostat.setTitle;
    this.setCenter = thermostat.setCenter;
    this.setPlanner = thermostat.setLedStates;

    thermostat.resize(this.resizer);

    /* init */
    this.resizer(); // also instantiate the component for the first time.
    return this;
  };
};

export default function (jQuery, window) {
  return init(jQuery, window)
}
