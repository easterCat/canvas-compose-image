### Canvas

Canvas 是 HTML5 新增的组件，就像一个画板，用 js 这杆笔，在上面乱涂乱画

创建一个 canvas

```
<canvas id="stockGraph" width="150" height="150"></canvas>
或
let canvas = document.createElement("canvas");
```

#### 渲染上下文

[CanvasRenderingContext2D](<(https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D)>)
使用 canvas.getContext('2d')方法让我们拿到一个 CanvasRenderingContext2D 对象，然后在这个上面画

```
//用getContext()判断是否支持canvas
if(canvas.getContext){
  let context = canvas.getContext('2d');
}
```

#### canvas 绘制文字

- fillStyle = color 设置图形的填充颜色。
- fillText(text,x,y,[, maxWidth]) 在指定的(x,y)位置填充指定的文本，绘制的最大宽度是可选的.
- strokeText(text, x, y [, maxWidth]) 在指定的(x,y)位置绘制文本边框，绘制的最大宽度是可选的.

设置 font，同 css 的 fong 属性

```
context.font = "italic 1.2em "Fira Sans", serif";
```

[css 的 font 属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font)是设置 font-style, font-variant, font-weight, font-size, line-height 和 font-family 属性的简写，或使用特定的关键字设置元素的字体为某个系统字体。

#### canvas 绘制图片

```
context.drawImage(img,x,y);
context.drawImage(img,x,y,width,height);其中 image 是 image 或者 canvas 对象，x 和 y 是其在目标 canvas 里的起始坐标，width 和 height，这两个参数用来控制 当向 canvas 画入时应该缩放的大小
context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
```

| 名称    | 作用                                                                                    |
| ------- | --------------------------------------------------------------------------------------- |
| img     | 用来被绘制的图像、画布或视频                                                            |
| sx      | 可选。img 被绘制区域的起始左上 x 坐标                                                   |
| sy      | 可选。img 被绘制区域的起始左上 y 坐标                                                   |
| swidth  | 可选。img 被绘制区域的宽度（如果没有后面的 width 或 height 参数，则可以伸展或缩小图像） |
| sheight | 可选。img 被绘制区域的高度（如果没有后面的 width 或 height 参数，则可以伸展或缩小图像） |
| x       | 画布上放置 img 的起始 x 坐标                                                            |
| y       | 画布上放置 img 的起始 y 坐标                                                            |
| width   | 可选。画布上放置 img 提供的宽度（可能会有图片剪裁效果）                                 |
| height  | 可选。画布上放置 img 提供的高度（可能会有图片剪裁效果）                                 |

> 使用 drawImage 进行切片 drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)，这个在图片合成的时候是利器，该实现中没用过（可以不用美工切好图再用，而是前端直接自己切图）

#### canvas.toDataURL()

- 如果该 canvas 的宽度或长度是 0,则会返回字符串"data:,".
- 如果指定的 type 参数不是 image/png,但返回的字符串是以 data:image/png 开头的,则所请求的图片类型不支持.
- Chrome 支持 image/webp 类型.
- 如果 type 参数的值为 image/jpeg 或 image/webp,则第二个参数的值如果在 0.0 和 1.0 之间的话,会被看作是图片质量参数,如果第二个参数的值不在 0.0 和 1.0 之间,则会使用默认的图片质量.

一个在线的精简版 ps 直接网页打开就可以用了http://www.uupoop.com/

#### img 标签的 onError,onLoad,onAbort

onError：当图片加载出现错误，会触发 经常在这里事件里头写入 将图片导向默认报错图片，以免页面上出现红色的叉叉

onLoad：事件是当图片加载完成之后触发

onAbort：图片加载的时候，用户通过点击停止加载（浏览器上的红色叉叉）时出发，通常在这里触发一个提示：“图片正在加载”

### 先准备一张图

![图片](<https://github.com/easterCat/canvas-compose-image/blob/master/img/timg%20(1).jpg?raw=true>)

然后用 ps 切成 4 张图，分别的是东邪西毒南帝北丐

### 合成 canvas 为图片的函数

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

### 效果，中神通呢

![中神通呢](https://github.com/easterCat/canvas-compose-image/blob/master/img/demo02.png?raw=true)

### 一个合成图片文字要求

需要做到

1. 能够将多张图片进行合成
2. 中间能够插入文字
3. 按照顺序进行画图，上层图层会盖住下层

问题

1. 图片加载完成事件是个异步的，文字同步画在画板上
2. onload 和 onerror 事件
3. 本地解决图片加载问题

我是在 vue 项目里面用（为了能够在没有任何编译环境下用，我没用 es6，如果是在 es6 中写这种 compose 可以用 class, promise , async 配合使用，要舒服很多）

amd，cmd，common 和 js 原生目前实现的模块不一样，是不兼容的，能够直接用 import 引入是 webpack 环境的功劳

可以直接复制粘贴上面的代码建个文件测试，也可以 npm install canvas-compose-image --save

#### 实现的效果

合成了一张图片，在美化下字体就 ok 了，可以直接下载在手机相册中。

![实现的效果](https://github.com/easterCat/canvas-compose-image/blob/master/img/demo01.png?raw=true)

#### 错误信息 Failed to execute 'drawImage'

> Uncaught TypeError: Failed to execute 'drawImage' on 'CanvasRenderingContext2D': The provided value is not of type '(CSSImageValue or HTMLImageElement or SVGImageElement or HTMLVideoElement or HTMLCanvasElement or ImageBitmap or OffscreenCanvas)'

你在使用 drawImage 方法的时候使用了不正确的元素，不如图片没有加载完或者没获取到正确的，是个 undefined，就会报错。可以试试将第一个参数设为 window，就会直接报错。

需要的节点在错误信息已经明确说了

#### 错误信息 Failed to execute 'toDataURL' on 'HTMLCanvasElement'

> Uncaught DOMException: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.

依然是老朋友，跨域的问题，别双击 html 打开就行了，撘个静态文件服务器就好了。demo 里面有个 server.js，用 node 启动一下就好了。

#### 错误信息 onload 和 onerror 都执行

没解决，只要有 onerror 一定会执行 onerror，注释掉就执行 onload，没明白

### npm 发布插件步骤

1. npm init
2. 添加过滤文件
3. npm publish

#### 黑名单模式：.npmignore 文件，没有.npmignore 情况下使用.gitignore 文件。(.gitignore 优先级会高些，小心)

跟.gitignore 一样

#### 白名单模式：package.json 里边配置 files 字段

```
"files": [
  "LICENSE",
  "History.md",
  "Readme.md",
  "index.js",
  "lib/"
]
```

#### 白名单模式：pkg.files 配置 files 字段，只发布配置的文件或目录

```
{
  "files": [
	  "index.js",
		"lib"
	]
}
```

### 参考

[MDN - canvas](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Basic_usage)
[使用 canvas 在前端实现图片水印合成](https://www.zhangxinxu.com/wordpress/2017/05/canvas-picture-watermark-synthesis/)
[CSS3 混合模式 mix-blend-mode/background-blend-mode 简介](https://www.zhangxinxu.com/wordpress/2015/05/css3-mix-blend-mode-background-blend-mode/)
[npm publish](https://cnodejs.org/topic/58b3aaea7872ea0864fee130)
[canvas.toDataURL() SecurityError](https://stackoverflow.com/questions/20424279/canvas-todataurl-securityerror)
[浏览器同源政策及其规避方法](http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html)
[canvas 问题浅析](https://juejin.im/entry/5865f38e570c3500688944c2)
