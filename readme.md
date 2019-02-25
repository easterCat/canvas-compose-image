#### 合成 canvas 为图片的函数

compose.js

```
(function(win) {
  var ComposeCanvas;
  var layer = {};
  var layer_queue = [];
  var canvasWH = [200, 200];
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");

  /**
   * 用来处理宽高和图层,返回合成结果
   * @param {*} WH canvas的宽高
   * @param {*} options canvas的图层
   */
  function compose(WH, options) {
    _handleWH(WH);
    _handleLayer(options);

    return function(back) {
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
    };
  }

  function convertCanvasToImage(c) {
    c = c || canvas;
    var image = new Image();
    var src = c.toDataURL("image/jpg");
    image.setAttribute("src", src);
    return image;
  }

  function _handleWH(WH) {
    canvasWH = WH || [200, 200];
    canvas.width = canvasWH[0];
    canvas.height = canvasWH[1];

    //https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D
    context.fillRect(0, 0, canvasWH[0], canvasWH[1]);
    context.fillStyle = "transparent"; //画布填充颜色;
  }

  function _handleLayer(options) {
    layer = options || {};

    Object.keys(layer).forEach(item => {
      layer_queue.push(layer[item]);
    });

    var length = layer_queue.length;

    if (length <= 0) {
      return;
    } else {
      while (length > 0) {
        var pos = layer_queue[0].pos;
        var src = layer_queue[0].src;
        var img = new Image();
        img.setAttribute("src", src);
        context.drawImage(img, pos[0], pos[1], pos[2], pos[3]);
        layer_queue.splice(0, 1);
        length--;
      }
    }
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

```

[canvas.toDataURL() SecurityError](https://stackoverflow.com/questions/20424279/canvas-todataurl-securityerror)
[浏览器同源政策及其规避方法](http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html)
[canvas 问题浅析](https://juejin.im/entry/5865f38e570c3500688944c2)
