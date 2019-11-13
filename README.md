# [107-2] Web Programming Final - Fashion Ceiba
This project was developed by [JacksonHsieh](https://github.com/hsiehjackson), [CynthiaYLiu](https://github.com/CynthiaYLiu), and [PierreSue](https://github.com/PierreSu). You can view this project on the browser through the following link [Fashion-Ceiba](https://fashion-ceiba.herokuapp.com/) and see the demonstration video by opening [Demo-video](https://youtu.be/NDc-VVZYLH0).

<img src="https://i.imgur.com/s3AY3au.jpg" alt="drawing"/> 

## About this project
* Topic : (Group 03) Fashion Ceiba
* Enable users to upload course handout, to update private and public notes immediately, and to ask questions online.
* Team member：解正平(B04901020)、劉芸欣(B04901152)、蘇峯廣(B04901070)

## Deployed Website
[Website Link](https://fashion-ceiba.herokuapp.com/)

## Demo Video
[Video Link](https://youtu.be/NDc-VVZYLH0)

## How to run
```
$ From Github:
    * git clone https://github.com/hsiehjackson/fashion-ceiba
    * change the MONGODB link in ./fashion-ceiba/.env
    * npm install (./fashion-ceiba/)
    * npm run server (./fashion-ceiba/)  - port:4000
    * npm run client1 (./fashion-ceiba/) - port:3000
    * npm run client2 (./fashion-ceiba/) - port:3001
    * If you want to use teacher mode, just sign up with name/email/pwd = ADMIN
$ From Deployed Link:
    * open https://fashion-ceiba.herokuapp.com/login
    * and enjoy
```

## 使用方式
* 登入介面，可以註冊或登入
    * 老師 (name/email/pwd == ADMIN/ADMIN/ADMIN)
    * 學生 (其他帳號)
* Ceiba 基本功能
    * 課程資訊
    * 老師資訊
    * 公佈欄/月曆
* PDF 上課講義瀏覽
    * 上傳大檔案 (需等一段時間)
    * 編輯學生自己的筆記 (即時)
    * 瀏覽老師上課的筆記 (即時)
    * 刪除當頁筆記
* 提出/回答問題 (聊天室)
    * 未讀訊息量
    * 學生提出問題
    * 老師收到問題並回答

## References
```
1. https://github.com/daisy3607/react-sketch
2. https://github.com/wojtekmaj/react-pdf
3. https://github.com/lykmapipo/mongoose-gridfs
```

## Dependencies
```
* mongodb/mongoose/mongoose-gridfs
* node.js
* express.js
* graphql-yoga
* react-apollo
* react-sketch
* react-pdf
* node-sass
* react.js
```

## Work Distribution
```
[JacksonHsieh](https://github.com/hsiehjackson)
    * Authetication/Basic funcion/PDF uploading  -- web interface/front end/back end/database
    * Deploy on herokuapp

[CynthiaYLiu](https://github.com/CynthiaYLiu)
    * Sketchboard -- web interface/front end/back end/database
    * Demo video editing

[PierreSue](https://github.com/PierreSu)
    * Chatroom -- web interface/front end/back end/database
    * README
```
