## canvas 合成图片和文字

#### 第一步，准备一张图

![图片](<https://github.com/easterCat/canvas-compose-image/blob/master/img/timg%20(1).jpg?raw=true>)

然后用 ps 切成 4 张图，分别的是东邪西毒南帝北丐

#### 合成 canvas 为图片的函数

compose.html

```
...
 <div class="img-list">
      <div><img class="compose" src="./img/timg-(1)_01.png" alt="" /></div>
      <div><img class="compose" src="./img/timg-(1)_02.png" alt="" /></div>
      <div><img class="compose" src="./img/timg-(1)_03.png" alt="" /></div>
      <div><img class="compose" src="./img/timg-(1)_04.png" alt="" /></div>
  </div>
...

<script type="text/javascript">
    window.onload = function() {
      var compose = document.querySelectorAll(".compose");
      var src_arr = [];
      compose.forEach(node => {
        src_arr.push(node.src);
      });

      ComposeCanvas.compose(
        [400, 400],
        [
          {
            src: src_arr[0],
            type: "image",
            mode: "waiting",
            pos: [200, 0, 200, 200]
          },
          {
            src: src_arr[1],
            type: "image",
            mode: "waiting",
            pos: [200, 200, 200, 200]
          },
          {
            src: src_arr[2],
            type: "image",
            mode: "waiting",
            pos: [0, 0, 200, 200]
          },
          {
            src: src_arr[3],
            type: "image",
            mode: "waiting",
            pos: [0, 200, 200, 200]
          },
          {
            text: "我是南帝",
            type: "text",
            mode: "waiting",
            pos: [50, 100],
            style: {
              color: "#333",
              font: "30px serif"
            }
          },
          {
            text: "我是北丐",
            type: "text",
            mode: "waiting",
            pos: [0, 320],
            style: {
              color: "#333",
              font: "40px serif"
            }
          },
          {
            text: "中神通呢？",
            type: "text",
            mode: "waiting",
            pos: [120, 220],
            style: {
              color: "#333",
              font: "40px serif"
            }
          }
        ],
        function(img) {
          console.log(img);
          document.getElementById("hello").appendChild(img);
        }
      );
    };
  </script>
```

compose.js

```
(function(win) {
  var ComposeCanvas,
    layer = [],
    callback,
    imgList = [],
    canvasWH = [200, 200];
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
    if (Object.prototype.toString.call(options) === "[object Array]") {
      layer = options;
    }

    var length = layer.length;

    for (var i = 0; i < length; i++) {
      if (layer[i]["type"] === "text") {
        layer[i]["mode"] = "complete";
        _checkLayerMode();
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
    //https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/drawImage
    layer[index]["mode"] = "complete";
    layer[index]["element"] = imgList[index];
    _checkLayermode();
  }

  // function _errorImg(i) {
  //   console.log("图片加载出错");
  //   layer[i]["mode"] = "error";
  //   _checkLayermode();
  // }

  function _checkLayerMode() {
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
```

#### 效果，中神通呢

![中神通呢](https://github.com/easterCat/canvas-compose-image/blob/master/img/demo02.png?raw=true)

#### 一个合成图片文字的 canvas 画图

需要做到

1. 能够将多张图片进行合成
2. 中间能够插入文字
3. 按照顺序进行画图，上层图层会盖住下层

问题

1. 图片加载完成事件是个异步的，文字同步画在画板上
2. onload 和 onerror 事件
3. 本地解决图片加载问题

我是在 vue 项目里面用（为了能够在没有任何编译环境下用，我没用 es6，如果是在 es6 中写这种 compose 可以用 promise 和 async 配合使用，要舒服很多）

可以直接复制粘贴上面的代码建个文件测试，也可以 npm install canvas-compose-image --save

#### 实现的效果

合成了一张图片，在美化下字体就 ok 了，可以直接下载在手机相册中。

![实现的效果](https://github.com/easterCat/canvas-compose-image/blob/master/img/demo01.png?raw=true)

##### Uncaught TypeError: Failed to execute 'drawImage' on 'CanvasRenderingContext2D': The provided value is not of type '(CSSImageValue or HTMLImageElement or SVGImageElement or HTMLVideoElement or HTMLCanvasElement or ImageBitmap or OffscreenCanvas)'

你在使用 drawImage 方法的时候使用了不正确的元素，不如图片没有加载完或者没获取到正确的，是个 undefined，就会报错。可以试试将第一个参数设为 window，就会直接报错。

需要的节点在错误信息已经明确说了

##### Uncaught DOMException: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.

依然是老朋友，跨域的问题，别双击 html 打开就行了，撘个静态文件服务器就好了。demo 里面有个 server.js，用 node 启动一下就好了。

##### onload 和 onerror 都执行

没解决，只要有 onerror 一定会执行 onerror，注释掉就执行 onload，没明白

### npm 发布插件

1. npm init
2. 添加过滤文件
3. npm publish

- 黑名单模式：.npmignore 文件，没有.npmignore 情况下使用.gitignore 文件。(.gitignore 优先级会高些，小心)

跟.gitignore 一样

- 白名单模式：package.json 里边配置 files 字段

```
"files": [
  "LICENSE",
  "History.md",
  "Readme.md",
  "index.js",
  "lib/"
]
```

- 白名单模式：pkg.files 配置 files 字段，只发布配置的文件或目录

```
{
  "files": [
	  "index.js",
		"lib"
	]
}
```

#### 参考

[npm publish](https://cnodejs.org/topic/58b3aaea7872ea0864fee130)
[canvas.toDataURL() SecurityError](https://stackoverflow.com/questions/20424279/canvas-todataurl-securityerror)
[浏览器同源政策及其规避方法](http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html)
[canvas 问题浅析](https://juejin.im/entry/5865f38e570c3500688944c2)