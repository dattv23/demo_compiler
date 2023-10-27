
# Demo compiler code

Run, build code with languages c, cpp, java, js, python



## Tech Stack

**Client:** React, Antd, TailwindCSS

**Server:** Node, Express, Mongodb


## Deployment

To deploy this project run

Run API
```bash
  cd .\api\
  npm run dev
```
Run UI
```bash
  cd .\demo\
  yarn start
```

## API Reference

#### Get all submissions

```http
  GET /api/submissions
```


#### Post submission

```http
  POST /api/submissions
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `string` | **Required**. userId of title to fetch |
| `title`      | `string` | **Required**. title of submission to fetch |
| `body`      | `string` | **Required**. body of submission to fetch |
| `language`      | `string` | **Required**. language of submission to fetch |




## Screenshots
![image](https://github.com/dattv23/demo_compiler/assets/94770505/96c91120-937a-42f5-91b5-c0d250ef88b6)
![image](https://github.com/dattv23/demo_compiler/assets/94770505/19fafdee-958b-4efc-a500-d6ca21c83fcb)
![image](https://github.com/dattv23/demo_compiler/assets/94770505/9124bbeb-76c2-4573-a51d-17a31745e09d)




