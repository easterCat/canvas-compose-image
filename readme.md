```
npm install canvas-compose-image --save
```

使用

```
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
