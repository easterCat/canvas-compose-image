(function(win) {
  var ComposeCanvas,
    layer,
    callback,
    imgList = [],
    canvasWH = [200, 200],
    layerQueue = [];
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");

  function backElement(back) {
    var $return;
    switch (back) {
      case "canvas":
        $return = canvas;
        break;
      case "image":
        $return = convertCanvasToImage(canvas);
        break;
      default:
        $return = canvas;
    }
    return $return;
  }

  /**
   * 用来处理宽高和图层,返回合成结果
   * @param {*} WH canvas的宽高
   * @param {*} options canvas的图层
   */
  function compose(WH, options, backEvent) {
    callback = backEvent;
    _handleWH(WH);
    _handleLayer(options);
  }

  function convertCanvasToImage(c) {
    c = c || canvas;
    var image = new Image();
    var src = c.toDataURL("image/png");
    image.setAttribute("src", src);
    image.setAttribute("crossOrigin", "anonymous");
    return image;
  }

  function _handleWH(WH) {
    canvasWH = WH || [200, 200];
    canvas.width = canvasWH[0];
    canvas.height = canvasWH[1];
    //https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D
    context.fillStyle = "transparent"; //画布填充颜色;
    context.fillRect(0, 0, canvasWH[0], canvasWH[1]);
  }

  function _handleLayer(options) {
    layer = Array.from(options) || [];
    var length = layer.length;
    for (var i = 0; i < length; i++) {
      if (layer[i]["type"] === "text") {
        layer[i]["mode"] = "complete";
        _checkLayermode();
      }

      if (layer[i]["type"] === "image") {
        var pos = layer[i].pos;
        var src = layer[i].src;
        imgList[i] = new Image(pos[2], pos[3]);
        imgList[i].setAttribute("src", src);

        imgList[i].onload = (function() {
          _loadedImg(i);
        })();

        // imgList[i].onerror = (function() {
        //   _errorImg(i);
        // })();
      }
    }
  }

  function _loadedImg(index) {
    console.log("加载完毕");
    //https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/drawImage
    layer[index]["mode"] = "complete";
    layer[index]["element"] = imgList[index];
    _checkLayermode();
  }

  function _errorImg(i) {
    console.log("图片加载出错");
    layer[i]["mode"] = "error";
    _checkLayermode();
  }

  function _checkLayermode() {
    var check = false;
    var current = 0;
    layer.forEach(function(item) {
      if (item.mode === "complete") {
        current++;
      }
      if (current === layer.length) {
        check = true;
      }
    });

    check && _draw();
  }

  function _draw() {
    layer.forEach(function(item) {
      if (item["type"] === "text") {
        context.fillStyle = item.style.color;
        context.font = item.style.font;
        context.fillText(item.text, item.pos[0], item.pos[1]);
      }
      if (item["type"] === "image" && item["element"]) {
        context.drawImage(item["element"], item.pos[0], item.pos[1], item.pos[2], item.pos[3]);
      }
    });

    var img = backElement("image");
    return callback && callback(img);
  }

  ComposeCanvas = {
    compose: compose,
    convert: convertCanvasToImage
  };

  if (typeof module !== `undefined` && typeof exports === `object`) {
    module.exports = ComposeCanvas; //commonjs
  } else if (typeof win.define === "function" && (win.define.amd || win.define.cmd)) {
    win.define("ComposeCanvas", [], function() {
      return ComposeCanvas;
    });
  } else {
    win.ComposeCanvas = ComposeCanvas;
  }
})(window);
